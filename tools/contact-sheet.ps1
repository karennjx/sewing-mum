# Builds a labelled contact sheet for a folder of photos so the images can be
# reviewed in one pass. Prints an index -> filename map in the exact order the
# tiles are drawn, so a tile number can be mapped back to a file without
# relying on how PowerShell happens to sort the names.
param(
  [Parameter(Mandatory = $true)][string]$Folder,
  [Parameter(Mandatory = $true)][string]$OutFile,
  [int]$Cell = 300,
  [int]$Cols = 6
)

Add-Type -AssemblyName System.Drawing

$files = @(Get-ChildItem -LiteralPath $Folder -File |
  Where-Object { $_.Extension -match '^\.(jpe?g|png|webp)$' } |
  Sort-Object -Property Name -CaseSensitive)

if ($files.Count -eq 0) { Write-Output "no images in $Folder"; exit 0 }

$rows = [Math]::Ceiling($files.Count / $Cols)
$sheet = New-Object System.Drawing.Bitmap(($Cols * $Cell), ($rows * $Cell))
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.Clear([System.Drawing.Color]::White)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
$labelBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(225, 0, 0, 0))

for ($i = 0; $i -lt $files.Count; $i++) {
  try { $img = [System.Drawing.Bitmap]::FromFile($files[$i].FullName) }
  catch { Write-Output ("{0,3}  <unreadable>  {1}" -f $i, $files[$i].Name); continue }

  $cx = ($i % $Cols) * $Cell
  $cy = [Math]::Floor($i / $Cols) * $Cell
  $s = [Math]::Min([double]($Cell - 6) / $img.Width, [double]($Cell - 6) / $img.Height)
  $w = [int]($img.Width * $s); $h = [int]($img.Height * $s)
  $g.DrawImage($img, ($cx + ($Cell - $w) / 2), ($cy + ($Cell - $h) / 2), $w, $h)
  $g.FillRectangle($labelBg, $cx, $cy, 46, 32)
  $g.DrawString("$i", $font, [System.Drawing.Brushes]::White, ($cx + 4), ($cy + 2))

  Write-Output ("{0,3}  {1}x{2,-5}  {3}" -f $i, $img.Width, $img.Height, $files[$i].Name)
  $img.Dispose()
}

$g.Dispose()
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$qp = New-Object System.Drawing.Imaging.EncoderParameters(1)
$qp.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 82)
New-Item -ItemType Directory -Force -Path (Split-Path $OutFile) | Out-Null
$sheet.Save($OutFile, $enc, $qp)
$sheet.Dispose()
Write-Output "sheet -> $OutFile"
