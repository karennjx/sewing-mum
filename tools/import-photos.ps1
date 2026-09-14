# Copies chosen photos out of the Drive folders into public/, resized to a
# sensible web width and re-encoded as JPEG. Source files are named explicitly
# rather than by index so a reshuffle in Drive cannot silently swap one photo
# for another.
#
# An optional "crop" of "left,top,right,bottom" (fractions of the source) is
# applied before the resize. Use tools/crop-preview.ps1 to choose one.

Add-Type -AssemblyName System.Drawing

$base = "G:\My Drive\Projects\Sewing Mum\Product photos"
$root = Join-Path $PSScriptRoot ".."
$maxWidth = 1200
$quality = 86

# Kim renumbered the Drive folders into her intended catalogue order, so every
# folder name here changed in September 2026. "Product - Wallet Bundle" became
# "Product - 3. Trio Bundle" (same source files), and Face Mask and Cup Sleeves
# were moved into Archive, so both have been dropped from the site.
$jobs = @(
  # Tissue Pouch
  @{ folder = "Product - 4. Tissue Pouch"; file = "D800B0B0-41C7-404D-818E-9A778A0D39B4_1_105_c.jpeg"; out = "tissue-pouch-1.jpg" }
  @{ folder = "Product - 4. Tissue Pouch"; file = "11B65382-0169-4E46-AD45-227F707FA594_1_105_c.jpeg"; out = "tissue-pouch-2.jpg" }
  @{ folder = "Product - 4. Tissue Pouch"; file = "953993DA-1863-49C4-B47C-3EAEA4B994D1_1_105_c.jpeg"; out = "tissue-pouch-3.jpg" }

  # Trio Bundle, listed as "Wallet Bundle" until Kim renamed the folder.
  @{ folder = "Product - 3. Trio Bundle"; file = "WhatsApp Image 2026-09-08 at 7.32.42 AM.jpeg";     out = "trio-bundle-1.jpg" }
  @{ folder = "Product - 3. Trio Bundle"; file = "WhatsApp Image 2026-09-08 at 7.32.42 AM (1).jpeg"; out = "trio-bundle-2.jpg" }
  @{ folder = "Product - 3. Trio Bundle"; file = "WhatsApp Image 2026-09-08 at 7.32.41 AM.jpeg";     out = "trio-bundle-3.jpg" }

  # Placemats
  @{ folder = "Product - 7. Placemat"; file = "42832CFE-8ADC-47E5-A77C-16B2DDA13CF7_1_105_c.jpeg"; out = "placemats-1.jpg" }
  @{ folder = "Product - 7. Placemat"; file = "619E4E07-5010-437C-B043-C4BBFBA61915_1_105_c.jpeg"; out = "placemats-2.jpg" }
  @{ folder = "Product - 7. Placemat"; file = "9B4BA88C-87EC-4ECE-AFA6-0B3AEB2CB1F2_1_105_c.jpeg"; out = "placemats-3.jpg" }

  # Christmas Placemats
  @{ folder = "Product - 7. Placemat"; file = "E509844E-9EAF-48B9-A8CA-4332C440DF90_4_5005_c.jpeg"; out = "christmas-placemats-1.jpg" }
  @{ folder = "Product - 7. Placemat"; file = "A3416282-3C55-4AEA-9608-03AA49FCFE10_4_5005_c.jpeg"; out = "christmas-placemats-2.jpg" }
  @{ folder = "Product - 7. Placemat"; file = "SM - Placemats (Xmas).jpeg";                          out = "christmas-placemats-3.jpg" }

  # Heat Pads. Two of the four available photos are skipped: "Head Pad_FB
  # Image 2.jpg" has a "Heat Pads" caption baked in, and "SM - Heat Pads 2.jpg"
  # is all but the same shot as "Head Pad_FB Image 1.jpg".
  @{ folder = "Product - 9. Heat Pad"; file = "Head Pad_FB Image 1.jpg"; out = "heat-pad-1.jpg" }
  @{ folder = "0. Photos";             file = "SM - Heat Pads 1.jpeg";  out = "heat-pad-2.jpg" }

  # Coasters. The folder Kim numbered for these is empty; the only photos of
  # them sit loose in "0. Photos".
  @{ folder = "0. Photos"; file = "SM - Coasters.jpg";   out = "coasters-1.jpg" }
  @{ folder = "0. Photos"; file = "SM - Coasters 2.jpeg"; out = "coasters-2.jpg" }

  # Corporate collaboration samples. Both are cropped: the first to cut the
  # "We customised your brand & name" caption baked into the Facebook version,
  # the second to bring the two labels close enough to read.
  @{ folder = "Corporate Collaboration"; file = "Corporate Sample FB_Image 1.jpg"; out = "brand-on-piece.jpg";    dir = "corporate"; crop = "0,0.27,1,0.845" }
  @{ folder = "Corporate Collaboration"; file = "Corporate Sample FB_Image 2.jpg"; out = "co-branded-label.jpg"; dir = "corporate"; crop = "0,0.26,1,0.78" }
)

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$qp = New-Object System.Drawing.Imaging.EncoderParameters(1)
$qp.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

$failed = 0
foreach ($j in $jobs) {
  $srcPath = Join-Path $base (Join-Path $j.folder $j.file)
  if (-not (Test-Path -LiteralPath $srcPath)) {
    Write-Output ("MISSING  {0}  <- {1}" -f $j.out, $j.file)
    $failed++
    continue
  }

  $img = [System.Drawing.Bitmap]::FromFile($srcPath)

  if ($j.crop) {
    $f = @($j.crop.Split(',') | ForEach-Object { [double]$_ })
    $srcRect = New-Object System.Drawing.Rectangle(
      [int]($f[0] * $img.Width), [int]($f[1] * $img.Height),
      [int](($f[2] - $f[0]) * $img.Width), [int](($f[3] - $f[1]) * $img.Height))
  } else {
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, $img.Height)
  }

  # [Math]::Min(1, x) picks the int overload and rounds x, so force doubles.
  $s = [Math]::Min([double]1.0, [double]$maxWidth / $srcRect.Width)
  $w = [int]($srcRect.Width * $s); $h = [int]($srcRect.Height * $s)

  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()

  $subdir = if ($j.dir) { $j.dir } else { "products" }
  $destDir = Join-Path $root "public\$subdir"
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  $outPath = Join-Path $destDir $j.out
  $bmp.Save($outPath, $enc, $qp)
  Write-Output ("{0,-14} {1,-28} {2}x{3,-5} {4,5} KB" -f $subdir, $j.out, $w, $h, [math]::Round((Get-Item $outPath).Length / 1KB))
  $bmp.Dispose(); $img.Dispose()
}

Write-Output "---"
Write-Output "$($jobs.Count - $failed)/$($jobs.Count) imported"
if ($failed -gt 0) { exit 1 }
