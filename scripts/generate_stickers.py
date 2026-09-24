#!/usr/bin/env python3
"""
generate_stickers.py
Creates die-cut shaped stickers with white borders and natural drop shadows
on a uniform #e5e7e7 background for portfolio project covers.
"""

import os
import sys
from PIL import Image, ImageFilter, ImageOps

BG_COLOR = (229, 231, 231)  # #e5e7e7
CANVAS_WIDTH = 1024
CANVAS_HEIGHT = 764

def make_sticker(
    input_path: str,
    output_thumb: str,
    output_lqip: str,
    max_dim: int = 460,
    border_radius: int = 18,
    shadow_offset_y: int = 12,
    shadow_blur: int = 24,
    shadow_opacity: float = 0.22,
    contact_shadow_blur: int = 8,
    contact_shadow_opacity: float = 0.35,
    custom_scale: float = 1.0,
):
    """
    Renders an RGBA logo/graphic as a die-cut sticker centered on #e5e7e7.
    """
    if not os.path.exists(input_path):
        print(f"Error: input file {input_path} does not exist.")
        return False

    img = Image.open(input_path).convert("RGBA")
    
    # Auto-crop empty transparent borders
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    # Scale to target dimension
    target_size = int(max_dim * custom_scale)
    w, h = img.size
    ratio = min(target_size / w, (target_size * 0.85) / h)
    new_w = max(1, int(w * ratio))
    new_h = max(1, int(h * ratio))
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Padding for border and shadow
    pad = border_radius * 2 + shadow_blur * 2 + 30
    expanded_w = new_w + pad * 2
    expanded_h = new_h + pad * 2

    # Place resized image on padded canvas
    base_img = Image.new("RGBA", (expanded_w, expanded_h), (0, 0, 0, 0))
    base_img.paste(img, (pad, pad), img)

    # Extract alpha mask
    alpha = base_img.split()[3]

    # Generate die-cut border by dilating alpha mask
    # Use MaxFilter for morphological dilation
    filter_size = border_radius * 2 + 1
    # Multiple passes for smooth rounding
    dilated_alpha = alpha.filter(ImageFilter.MaxFilter(filter_size))
    # Slight blur and threshold for smooth squircle-like rounded edges
    dilated_alpha = dilated_alpha.filter(ImageFilter.GaussianBlur(radius=2))
    # Thresholding back to solid
    dilated_alpha = dilated_alpha.point(lambda p: 255 if p > 60 else 0)

    # Create white sticker border layer
    white_border = Image.new("RGBA", (expanded_w, expanded_h), (255, 255, 255, 255))
    white_border.putalpha(dilated_alpha)

    # Composite base image over white border
    sticker = Image.alpha_composite(white_border, base_img)

    # Get final sticker alpha for drop shadow
    sticker_alpha = sticker.split()[3]

    # 1. Contact shadow (tight, darker)
    contact_shadow = Image.new("RGBA", (expanded_w, expanded_h), (0, 0, 0, 0))
    contact_alpha = sticker_alpha.point(lambda p: int(p * contact_shadow_opacity))
    contact_shadow.putalpha(contact_alpha)
    contact_shadow = contact_shadow.filter(ImageFilter.GaussianBlur(contact_shadow_blur))

    # 2. Ambient shadow (diffuse, softer, downward offset)
    ambient_shadow = Image.new("RGBA", (expanded_w, expanded_h), (0, 0, 0, 0))
    ambient_alpha = sticker_alpha.point(lambda p: int(p * shadow_opacity))
    ambient_shadow.putalpha(ambient_alpha)
    ambient_shadow = ambient_shadow.filter(ImageFilter.GaussianBlur(shadow_blur))

    # Composite shadows onto full expanded image
    shadow_layer = Image.new("RGBA", (expanded_w, expanded_h), (0, 0, 0, 0))
    # Paste ambient shadow shifted down
    shadow_layer.paste(ambient_shadow, (0, shadow_offset_y), ambient_shadow)
    # Paste contact shadow shifted slightly down
    shadow_layer.paste(contact_shadow, (0, int(shadow_offset_y * 0.3)), contact_shadow)

    # Combine shadow + sticker
    sticker_with_shadow = Image.alpha_composite(shadow_layer, sticker)

    # Center on final canvas 1024x764
    final_canvas = Image.new("RGB", (CANVAS_WIDTH, CANVAS_HEIGHT), BG_COLOR)
    center_x = (CANVAS_WIDTH - expanded_w) // 2
    center_y = (CANVAS_HEIGHT - expanded_h) // 2

    final_canvas.paste(sticker_with_shadow, (center_x, center_y), sticker_with_shadow)

    # Save thumb.webp
    os.makedirs(os.path.dirname(output_thumb), exist_ok=True)
    final_canvas.save(output_thumb, "WEBP", quality=92)
    print(f"✓ Saved {output_thumb} ({os.path.getsize(output_thumb) // 1024} KB)")

    # Save LQIP if requested
    if output_lqip:
        lqip = final_canvas.resize((32, 24), Image.Resampling.BILINEAR)
        lqip.save(output_lqip, "WEBP", quality=20)
        print(f"✓ Saved {output_lqip} ({os.path.getsize(output_lqip)} B)")

    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 generate_stickers.py <input_img> <output_thumb.webp> [scale]")
        sys.exit(1)
    
    scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
    make_sticker(sys.argv[1], sys.argv[2], output_lqip="", custom_scale=scale)
