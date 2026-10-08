# Upstream library

This is @ybouane/liquidglass 1.0.3 from npm, referenced by https://liquid-glass.ybouane.com/. Its package metadata declares the MIT license. Shader sources and rendering behavior are retained. EXI OS adds a bounded least-recently-used framebuffer cache in GlassRenderer.ts so repeated widget resizing cannot retain unlimited GPU buffers. The renderer JavaScript and source map are rebuilt from that source; the remaining distribution is unchanged.

The published package has `postinstall: patch-package` but does not publish the patch utility or any patch files. EXI OS vendors this exact release and removes only scripts/devDependencies from its package metadata so an ordinary npm ci does not fail. No runtime code was replaced with an imitation.

Renderer integration: one WebGL instance samples the original wallpaper image and draws refracted backplates behind the actual UI. Text remains normal accessible HTML. No websites are captured into this effect. Reduced-effects mode tears down WebGL and returns to opaque glass surfaces.
