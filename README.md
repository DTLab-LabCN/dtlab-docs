# The Cayman-Docs theme

Cayman-Docs is a fork of the Jekyll theme [Cayman](https://github.com/pages-themes/cayman) for GitHub Pages. This theme was edited from the original Cayman to be more docs friendly; This is achieved by defaulting the layout on dark mode, adding content navigation, and friendly layer indention. Originaly made for [coro-docs](https://bilal2453.github.io/coro-docs/).

![Thumbnail of Cayman](thumbnail.png)

## Todo

1. More responsive/scroll-based navigator (when JS is enabled).
2. Implementing heading indention.
3. General styling enhancements.

## Usage

To use the Cayman-Docs theme:

1. Add the following to your site's `_config.yml`:

    ```yml
    remote_theme: Bilal2453/cayman-docs
    ```

## Customizing

### Configuration variables

Cayman will respect the following variables, if set in your site's `_config.yml`:

```yml
title: [The title of your site]
description: [A short description of your site's purpose]
```

Additionally, you may choose to set the following optional variables:

```yml
show_downloads: ["true" or "false" to indicate whether to provide a download URL]
google_analytics: [Your Google Analytics tracking ID]
```

### Stylesheet

If you'd like to add your own custom styles:

1. Create a file called `/assets/css/style.scss` in your site
2. Add the following content to the top of the file, exactly as shown:
    ```scss
    ---
    ---

    @import "{{ site.theme }}";
    ```
3. Add any custom CSS (or Sass, including imports) you'd like immediately after the `@import` line

*Note: If you'd like to change the theme's Sass variables, you must set new values before the `@import` line in your stylesheet.*

### Layouts

If you'd like to change the theme's HTML layout:

1. [Copy the original default template](https://github.com/Bilal2453/cayman-docs/blob/master/_layouts/default.html) or [the documentation layout page](https://github.com/Bilal2453/cayman-docs/blob/master/_layouts/doc.html) from the theme's repository<br />(*Pro-tip: click "raw" to make copying easier*)
2. Create a file called `/_layouts/default.html` (or `/_layouts/doc.html`) in your site
3. Paste the default layout content copied in the first step
4. Customize the layout as you'd like

### Overriding GitHub-generated URLs

Templates often rely on URLs supplied by GitHub such as links to your repository or links to download your project. If you'd like to override one or more default URLs:

1. Look at [the template source](https://github.com/Bilal2453/cayman-docs/blob/master/_layouts/default.html) to determine the name of the variable. It will be in the form of `{{ site.github.zip_url }}`.
2. Specify the URL that you'd like the template to use in your site's `_config.yml`. For example, if the variable was `site.github.url`, you'd add the following:
    ```yml
    github:
      zip_url: http://example.com/download.zip
      another_url: another value
    ```
3. When your site is built, Jekyll will use the URL you specified, rather than the default one provided by GitHub.

*Note: You must remove the `site.` prefix, and each variable name (after the `github.`) should be indent with two space below `github:`.*

For more information, see [the Jekyll variables documentation](https://jekyllrb.com/docs/variables/).

### Previewing the theme locally

If you'd like to preview the theme locally (for example, in the process of proposing a change):

1. Clone down the theme's repository (`git clone https://github.com/Bilal2453/cayman-docs`)
2. `cd` into the theme's directory
3. Run `script/bootstrap` to install the necessary dependencies
4. Run `bundle exec jekyll serve` to start the preview server
5. Visit [`localhost:4000`](http://localhost:4000) in your browser to preview the theme
