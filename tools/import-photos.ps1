# Copies chosen product photos out of the Drive folder into public/products,
# resized to a sensible web width and re-encoded as JPEG. Source files are
# named explicitly rather than by index so a reshuffle in Drive cannot silently
# swap one photo for another.

Add-Type -AssemblyName System.Drawing

$base = "G:\My Drive\Projects\Sewing Mum\Product photos"
$dest = Join-Path $PSScriptRoot "..\public\products"
$maxWidth = 1200
$quality = 86

$jobs = @(
  # Tissue Pouch
  @{ folder = "Product - Tissue Pouches"; file = "D800B0B0-41C7-404D-818E-9A778A0D39B4_1_105_c.jpeg"; out = "tissue-pouch-1.jpg" }
  @{ folder = "Product - Tissue Pouches"; file = "11B65382-0169-4E46-AD45-227F707FA594_1_105_c.jpeg"; out = "tissue-pouch-2.jpg" }
  @{ folder = "Product - Tissue Pouches"; file = "953993DA-1863-49C4-B47C-3EAEA4B994D1_1_105_c.jpeg"; out = "tissue-pouch-3.jpg" }

  # Wallet Bundle
  @{ folder = "Product - Wallet Bundle"; file = "WhatsApp Image 2026-09-08 at 7.32.42 AM.jpeg";     out = "wallet-bundle-1.jpg" }
  @{ folder = "Product - Wallet Bundle"; file = "WhatsApp Image 2026-09-08 at 7.32.42 AM (1).jpeg"; out = "wallet-bundle-2.jpg" }
  @{ folder = "Product - Wallet Bundle"; file = "WhatsApp Image 2026-09-08 at 7.32.41 AM.jpeg";     out = "wallet-bundle-3.jpg" }

  # Placemats
  @{ folder = "Product - Placemat"; file = "42832CFE-8ADC-47E5-A77C-16B2DDA13CF7_1_105_c.jpeg"; out = "placemats-1.jpg" }
  @{ folder = "Product - Placemat"; file = "619E4E07-5010-437C-B043-C4BBFBA61915_1_105_c.jpeg"; out = "placemats-2.jpg" }
  @{ folder = "Product - Placemat"; file = "9B4BA88C-87EC-4ECE-AFA6-0B3AEB2CB1F2_1_105_c.jpeg"; out = "placemats-3.jpg" }

  # Christmas Placemats
  @{ folder = "Product - Placemat"; file = "E509844E-9EAF-48B9-A8CA-4332C440DF90_4_5005_c.jpeg"; out = "christmas-placemats-1.jpg" }
  @{ folder = "Product - Placemat"; file = "A3416282-3C55-4AEA-9608-03AA49FCFE10_4_5005_c.jpeg"; out = "christmas-placemats-2.jpg" }
  @{ folder = "Product - Placemat"; file = "SM - Placemats (Xmas).jpeg";                          out = "christmas-placemats-3.jpg" }

  # Cup Sleeve
  @{ folder = "Product - Cup Sleeves"; file = "722977CC-FC8C-4FBF-BD07-87BED5E83B90_1_105_c.jpeg"; out = "cup-sleeve-1.jpg" }
  @{ folder = "Product - Cup Sleeves"; file = "AEBBE7D8-92F0-4E78-B8E2-F486A0F0180F_1_105_c.jpeg"; out = "cup-sleeve-2.jpg" }
  @{ folder = "Product - Cup Sleeves"; file = "SM - Cup Sleeves.jpg";                              out = "cup-sleeve-3.jpg" }
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
  # [Math]::Min(1, x) picks the int overload and rounds x, so force doubles.
  $s = [Math]::Min([double]1.0, [double]$maxWidth / $img.Width)
  $w = [int]($img.Width * $s); $h = [int]($img.Height * $s)

  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.DrawImage($img, 0, 0, $w, $h)
  $g.Dispose()

  $outPath = Join-Path $dest $j.out
  $bmp.Save($outPath, $enc, $qp)
  Write-Output ("{0,-28} {1}x{2,-5} {3,5} KB" -f $j.out, $w, $h, [math]::Round((Get-Item $outPath).Length / 1KB))
  $bmp.Dispose(); $img.Dispose()
}

Write-Output "---"
Write-Output "$($jobs.Count - $failed)/$($jobs.Count) imported"
if ($failed -gt 0) { exit 1 }
