import sys
import os

try:
    from PIL import Image
except ImportError:
    print("Pillow is not installed. Please install it using 'pip install Pillow'")
    sys.exit(1)

source_path = r"C:/Users/wogus/.gemini/antigravity/brain/08765193-9c88-46df-be7d-078e383bc574/marklog_favicon_indigo_1768190029021.png"
output_dir = r"web-app/public"

if not os.path.exists(source_path):
    print(f"Source image not found at {source_path}")
    sys.exit(1)

try:
    img = Image.open(source_path)
    
    # 1. favicon-16x16.png
    img_16 = img.resize((16, 16), Image.Resampling.LANCZOS)
    img_16.save(os.path.join(output_dir, "favicon-16x16.png"))
    print("Generated favicon-16x16.png")

    # 2. favicon-32x32.png
    img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    img_32.save(os.path.join(output_dir, "favicon-32x32.png"))
    print("Generated favicon-32x32.png")

    # 3. favicon.ico (multi-size)
    # Common sizes for ico
    limit_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    img.save(os.path.join(output_dir, "favicon.ico"), sizes=limit_sizes)
    print("Generated favicon.ico")
    
except Exception as e:
    print(f"Error processing images: {e}")
    sys.exit(1)
