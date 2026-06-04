import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'

const footerLinks = ['Privacy Policy', 'Terms of Service', 'Data Sources', 'API Documentation']

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        px: { xs: 2, md: 4 },
        py: 3,
        backgroundColor: 'rgba(3, 8, 14, 0.82)',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={{ maxWidth: 1080, mx: 'auto', width: '100%' }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700 }}>WeatherDay</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © 2026 WeatherDay Atmospheric Systems
          </Typography>
        </Box>

        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          {footerLinks.map((entry) => (
            <Link key={entry} href="#" underline="hover" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
              {entry}
            </Link>
          ))}
          <IconButton aria-label="Share" size="small" sx={{ color: 'text.secondary' }}>
            <ShareOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  )
}
