# Draws the stand-in image used by products that are in Kim's Drive but have no
# usable photograph yet. Deliberately plain and obviously not a product shot, so
# nobody mistakes it for one. Colours are the tokens from app/globals.css.
Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot "..\public\products\photo-coming.jpg"
$size = 1200

$linen = [System.Drawing.Color]::FromArgb(0xF8, 0xEA, 0xEA)
$linenDark = [System.Drawing.Color]::FromArgb(0xEC, 0xD2, 0xD4)
$berry = [System.Drawing.Color]::FromArgb(0x9A, 0x33, 0x46)
$muted = [System.Drawing.Color]::FromArgb(0x7C, 0x66, 0x69)

$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear($linen)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# A dashed frame, so it reads as an empty slot waiting to be filled.
$pen = New-Object System.Drawing.Pen($linenDark, 6)
$pen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$g.DrawRectangle($pen, 70, 70, ($size - 140), ($size - 140))

$fmt = New-Object System.Drawing.StringFormat
$fmt.Alignment = [System.Drawing.StringAlignment]::Center
$fmt.LineAlignment = [System.Drawing.StringAlignment]::Center

$title = New-Object System.Drawing.Font("Georgia", 66, [System.Drawing.FontStyle]::Bold)
$sub = New-Object System.Drawing.Font("Segoe UI", 34)
$berryBrush = New-Object System.Drawing.SolidBrush($berry)
$mutedBrush = New-Object System.Drawing.SolidBrush($muted)

$g.DrawString("Photograph", $title, $berryBrush,
  (New-Object System.Drawing.RectangleF(0, ($size / 2 - 130), $size, 120)), $fmt)
$g.DrawString("coming", $title, $berryBrush,
  (New-Object System.Drawing.RectangleF(0, ($size / 2 - 10), $size, 120)), $fmt)
$g.DrawString("Sewing Mums", $sub, $mutedBrush,
  (New-Object System.Drawing.RectangleF(0, ($size / 2 + 140), $size, 70)), $fmt)

$g.Dispose()
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$qp = New-Object System.Drawing.Imaging.EncoderParameters(1)
$qp.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90)
$bmp.Save($out, $enc, $qp)
$bmp.Dispose()
Write-Output ("photo-coming.jpg  {0}x{0}  {1} KB" -f $size, [math]::Round((Get-Item $out).Length / 1KB))
