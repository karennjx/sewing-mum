# Renders candidate crops of one photo side by side so the right framing can be
# chosen by eye before committing to it. Crop rectangles are given as
# fractions of the source so they read the same whatever the pixel size is.
param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$OutFile,
  # Semicolon-separated candidates, each "left,top,right,bottom" as fractions
  # of width/height. One string rather than an array because powershell -File
  # splits array arguments on commas.
  [Parameter(Mandatory = $true)][string]$Crops,
  [int]$Cell = 460
)

Add-Type -AssemblyName System.Drawing

# A new variable, not $Crops: the parameter is typed [string], so assigning an
# array back into it would coerce it straight back to a single string.
$rects = @($Crops.Split(';'))

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path -LiteralPath $Source))
$sheet = New-Object System.Drawing.Bitmap(($Cell * $rects.Count), $Cell)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.Clear([System.Drawing.Color]::White)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Bold)
$bg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(225, 0, 0, 0))

for ($i = 0; $i -lt $rects.Count; $i++) {
  $f = @($rects[$i].Split(',') | ForEach-Object { [double]$_ })
  $x = [int]($f[0] * $img.Width);  $y = [int]($f[1] * $img.Height)
  $w = [int](($f[2] - $f[0]) * $img.Width)
  $h = [int](($f[3] - $f[1]) * $img.Height)
  $src = New-Object System.Drawing.Rectangle($x, $y, $w, $h)

  $s = [Math]::Min([double]($Cell - 8) / $w, [double]($Cell - 8) / $h)
  $dw = [int]($w * $s); $dh = [int]($h * $s)
  $dst = New-Object System.Drawing.Rectangle(($i * $Cell + ($Cell - $dw) / 2), (($Cell - $dh) / 2), $dw, $dh)
  $g.DrawImage($img, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)

  $g.FillRectangle($bg, ($i * $Cell), 0, 240, 30)
  $g.DrawString("$i  $($rects[$i])", $font, [System.Drawing.Brushes]::White, ($i * $Cell + 4), 2)
  Write-Output ("{0}  {1}  -> {2}x{3}" -f $i, $rects[$i], $w, $h)
}

$g.Dispose()
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$qp = New-Object System.Drawing.Imaging.EncoderParameters(1)
$qp.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 88)
New-Item -ItemType Directory -Force -Path (Split-Path $OutFile) | Out-Null
$sheet.Save($OutFile, $enc, $qp)
$sheet.Dispose(); $img.Dispose()
Write-Output "sheet -> $OutFile"
