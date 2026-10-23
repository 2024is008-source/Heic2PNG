Real HEIC fixtures (test inputs only; not shipped in dist):

- `example.heic`: https://github.com/strukturag/libheif/blob/master/examples/example.heic (1280×854 primary frame).
- `arrow.heic`: https://github.com/bigcat88/pillow_heif/blob/master/tests/images/heif_other/arrow.heic (3024×4032 portrait, HEIF `irot` property = 3; arrow points up).
- `unsupported-depth.heic`: https://github.com/bigcat88/pillow_heif/blob/master/tests/images/heif_special/unsupported_depth_image.heic (auxiliary-depth limitation sample; primary image can still decode).
- `tailwind-cdn.js`: exact original prototype runtime from https://cdn.tailwindcss.com/3.4.17, used only to compare against independent CDN-generated CSS.
- `google-fonts.css`: original Google Fonts API response; production locally hosts these exact font families/weights and their OFL licenses.

Fixture provenance is retained in the upstream tree snapshots. These are public upstream test assets; their upstream licensing applies.
