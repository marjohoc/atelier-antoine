const Image = require("@11ty/eleventy-img");
const path = require("path");
const { marked } = require("marked");

/**
 * Shortcode image responsive via eleventy-img
 * Génère picture/source WebP + JPEG, lazy loading, alt obligatoire
 */
async function imageShortcode(src, alt, sizes, className) {
  if (!alt) {
    throw new Error(`[eleventy-img] Attribut alt manquant pour l'image : ${src}`);
  }
  if (!src) {
    return `<div class="img-placeholder" role="img" aria-label="Photo à venir"><span>Photo à venir</span></div>`;
  }

  // Convertit /uploads/... en chemin système src/uploads/...
  let imgSrc = src;
  if (src.startsWith("/uploads/")) {
    imgSrc = path.join(process.cwd(), "src", src);
  }

  try {
    const metadata = await Image(imgSrc, {
      widths: [400, 800, 1200],
      formats: ["webp", "jpeg"],
      outputDir: "./_site/img/",
      urlPath: "/img/",
      cacheOptions: {
        duration: "1d",
        directory: ".cache",
      },
    });

    const attrs = {
      alt,
      sizes: sizes || "(min-width: 1024px) 50vw, 100vw",
      loading: "lazy",
      decoding: "async",
    };
    if (className) attrs.class = className;

    return Image.generateHTML(metadata, attrs);
  } catch (err) {
    console.warn(`[eleventy-img] Impossible de traiter ${src} :`, err.message);
    return `<img src="${src}" alt="${alt}" loading="lazy"${className ? ` class="${className}"` : ""}>`;
  }
}

module.exports = function (eleventyConfig) {
  // --- Passthrough ---
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/uploads");

  // --- Shortcodes ---
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // --- Filters ---
  eleventyConfig.addFilter("filterByCategorie", (collection, categorie) =>
    collection.filter((item) => item.data.categorie === categorie)
  );

  eleventyConfig.addFilter("jsonify", (obj) => JSON.stringify(obj));

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
    });
  });

  eleventyConfig.addFilter("markdownify", (str) => {
    if (!str) return "";
    return marked.parse(str);
  });

  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    try {
      return new URL(url, base).toString();
    } catch {
      return url;
    }
  });

  // --- Collections ---
  eleventyConfig.addCollection("realisations", (api) =>
    api
      .getFilteredByGlob("src/realisations/*.md")
      .sort((a, b) => (b.data.date || 0) - (a.data.date || 0))
  );

  // --- Config ---
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
