Add-Type -AssemblyName System.Drawing

function New-GradientImage {
  param(
    [string]$Path,
    [int]$Width,
    [int]$Height,
    [string]$Title,
    [int]$FontSize = 60,
    [string]$Wordmark = 'econstruct'
  )

  $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $rect = New-Object System.Drawing.Rectangle 0, 0, $Width, $Height
  $startColor = [System.Drawing.Color]::FromArgb(200,16,46)
  $endColor = [System.Drawing.Color]::FromArgb(139,0,0)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $startColor, $endColor, 35
  $graphics.FillRectangle($brush, $rect)

  $overlayBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30,255,255,255))
  $graphics.FillEllipse($overlayBrush, -120, -80, 420, 420)
  $graphics.FillEllipse($overlayBrush, ($Width - 280), ($Height - 220), 340, 340)

  $font = New-Object System.Drawing.Font('Arial', $FontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $wordmarkFont = New-Object System.Drawing.Font('Arial', [Math]::Max(24, [int]($FontSize * 0.38)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $whiteBrush = [System.Drawing.Brushes]::White
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center

  $textRect = New-Object System.Drawing.RectangleF 120, 120, ($Width - 240), ($Height - 240)
  $graphics.DrawString($Title, $font, $whiteBrush, $textRect, $format)

  $wordmarkSize = $graphics.MeasureString($Wordmark, $wordmarkFont)
  $graphics.DrawString($Wordmark, $wordmarkFont, $whiteBrush, ($Width - $wordmarkSize.Width - 42), ($Height - $wordmarkSize.Height - 28))

  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
  $brush.Dispose()
  $overlayBrush.Dispose()
  $font.Dispose()
  $wordmarkFont.Dispose()
}

function New-AuthorPlaceholder {
  param(
    [string]$Path,
    [int]$Size = 800
  )

  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::FromArgb(245,242,238))

  $circleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(200,16,46))
  $graphics.FillEllipse($circleBrush, 100, 100, 600, 600)

  $font = New-Object System.Drawing.Font('Arial', 210, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.DrawString('FN', $font, [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF 100, 120, 600, 560), $format)

  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
  $circleBrush.Dispose()
  $font.Dispose()
}

New-Item -ItemType Directory -Force 'public\blog' | Out-Null
New-Item -ItemType Directory -Force 'public\authors' | Out-Null

$images = @(
  @{ Base = 'blog_01_palisades_rebuild_guide'; Title = 'Pacific Palisades\nFire Rebuild Guide' },
  @{ Base = 'blog_02_insurance_gap'; Title = 'Closing the\nInsurance Gap' },
  @{ Base = 'blog_03_brentwood_luxury'; Title = 'Brentwood Luxury\nModernization' },
  @{ Base = 'blog_04_wui_compliance'; Title = 'Chapter 7A WUI\nCompliance Guide' },
  @{ Base = 'blog_05_hillside_geotech'; Title = 'Santa Monica Hillside\nGeotechnical Guide' },
  @{ Base = 'blog_06_smart_home'; Title = 'Luxury Smart Home\nSystems' },
  @{ Base = 'blog_07_altadena_rebuild'; Title = 'Altadena Rebuild\nReality' },
  @{ Base = 'blog_08_vet_contractor'; Title = 'Vet a Fire Rebuild\nContractor' }
)

foreach ($image in $images) {
  New-GradientImage -Path (Join-Path 'public\blog' ($image.Base + '.png')) -Width 1600 -Height 900 -Title $image.Title -FontSize 64
  New-GradientImage -Path (Join-Path 'public\blog' ($image.Base + '_og.png')) -Width 1200 -Height 630 -Title $image.Title -FontSize 52
}

New-AuthorPlaceholder -Path 'public\authors\frank-neimroozi.png'
