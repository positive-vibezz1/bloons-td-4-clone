namespace BloonsTD4App;

using System;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Windows.Forms;
using Microsoft.Web.WebView2.WinForms;
using Microsoft.Web.WebView2.Core;

public partial class Form1 : Form
{
    private WebView2? _webView;
    private bool _isFullScreen = false;
    private FormWindowState _prevWindowState = FormWindowState.Normal;
    private FormBorderStyle _prevBorderStyle = FormBorderStyle.Sizable;

    public Form1()
    {
        InitializeComponent();

        Text = "Bloons Tower Defense 4";
        ClientSize = new Size(1280, 750);
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(1000, 600);
        BackColor = Color.FromArgb(18, 30, 24);

        // Set application icon
        try
        {
            string iconPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "assets", "icon.ico");
            if (File.Exists(iconPath))
            {
                Icon = new Icon(iconPath);
            }
        }
        catch { }

        _webView = new WebView2
        {
            Dock = DockStyle.Fill
        };
        Controls.Add(_webView);

        Load += Form1_Load;
    }

    private async void Form1_Load(object? sender, EventArgs e)
    {
        try
        {
            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string appDataDir = Path.Combine(localAppData, "BloonsTD4App");
            Directory.CreateDirectory(appDataDir);

            string userDataFolder = Path.Combine(appDataDir, "WebView2Profile");
            Directory.CreateDirectory(userDataFolder);

            // Determine content directory
            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            string contentDir = appDir;
            string indexPath = Path.Combine(appDir, "index.html");

            // If index.html is missing in current folder (e.g. standalone single-file exe moved elsewhere),
            // always extract embedded assets into LocalAppData so updates take effect immediately
            if (!File.Exists(indexPath) || !Directory.Exists(Path.Combine(appDir, "assets")))
            {
                string extractedDir = Path.Combine(appDataDir, "GameContent");
                Directory.CreateDirectory(extractedDir);
                ExtractEmbeddedZip(extractedDir);
                contentDir = extractedDir;
            }

            var options = new CoreWebView2EnvironmentOptions
            {
                AdditionalBrowserArguments = "--autoplay-policy=no-user-gesture-required --disable-http-cache --disk-cache-size=1 --disable-features=msWebOOUI,msPdfOOUI"
            };

            var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder, options);
            if (_webView == null) return;
            await _webView.EnsureCoreWebView2Async(env);

            // Virtual host mapping - completely offline, zero ports, zero socket conflicts
            _webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                "bloons.game",
                contentDir,
                CoreWebView2HostResourceAccessKind.Allow
            );

            // App presentation settings
            _webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            _webView.CoreWebView2.Settings.AreDevToolsEnabled = true;
            _webView.CoreWebView2.Settings.IsZoomControlEnabled = false;
            _webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;

            // HTML5 Fullscreen support
            _webView.CoreWebView2.ContainsFullScreenElementChanged += (s, args) =>
            {
                if (_webView.CoreWebView2.ContainsFullScreenElement)
                {
                    if (!_isFullScreen)
                    {
                        _prevWindowState = WindowState;
                        _prevBorderStyle = FormBorderStyle;
                        FormBorderStyle = FormBorderStyle.None;
                        WindowState = FormWindowState.Maximized;
                        _isFullScreen = true;
                    }
                }
                else
                {
                    if (_isFullScreen)
                    {
                        FormBorderStyle = _prevBorderStyle;
                        WindowState = _prevWindowState;
                        _isFullScreen = false;
                    }
                }
            };

            // Navigate to virtual host with cache-buster
            _webView.CoreWebView2.Navigate($"https://bloons.game/index.html?v={DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                $"Failed to start Bloons TD 4:\n\n{ex.Message}\n\nMake sure the Microsoft Edge WebView2 Runtime is installed.",
                "Bloons TD 4 Error",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error
            );
        }
    }

    private void ExtractEmbeddedZip(string targetDirectory)
    {
        try
        {
            var assembly = Assembly.GetExecutingAssembly();
            // Try standard naming for embedded resource
            string resourceName = "BloonsTD4App.game_content.zip";
            using Stream? stream = assembly.GetManifestResourceStream(resourceName);
            if (stream != null)
            {
                using var archive = new ZipArchive(stream);
                archive.ExtractToDirectory(targetDirectory, overwriteFiles: true);
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Embedded extract warning: {ex.Message}");
        }
    }
}
