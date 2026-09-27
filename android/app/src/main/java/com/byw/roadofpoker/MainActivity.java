package com.byw.roadofpoker;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.window.OnBackInvokedDispatcher;

public class MainActivity extends Activity {
    private static final String GAME_URL = "https://willylehun.github.io/road-of-poker/?app=14";
    private static final String TRUSTED_HOST = "willylehun.github.io";
    private static final String TRUSTED_PATH = "/road-of-poker/";
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(Color.rgb(5, 10, 8));
        getWindow().setNavigationBarColor(Color.rgb(5, 10, 8));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(5, 10, 8));
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setFilterTouchesWhenObscured(true);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setGeolocationEnabled(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        WebView.setWebContentsDebuggingEnabled(false);
        CookieManager.getInstance().setAcceptCookie(false);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidApp");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!request.isForMainFrame()) return true;
                if (isTrustedGameUri(uri)) return false;
                if ("https".equalsIgnoreCase(uri.getScheme())) {
                    Intent externalIntent = new Intent(Intent.ACTION_VIEW, uri);
                    externalIntent.addCategory(Intent.CATEGORY_BROWSABLE);
                    try {
                        startActivity(externalIntent);
                    } catch (RuntimeException ignored) {
                        // A missing browser must not crash the game.
                    }
                }
                return true;
            }
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                this::handleBackNavigation
            );
        }

        webView.loadUrl(GAME_URL);
    }

    private boolean isTrustedGameUri(Uri uri) {
        String path = uri.getPath();
        return "https".equalsIgnoreCase(uri.getScheme())
            && TRUSTED_HOST.equalsIgnoreCase(uri.getHost())
            && path != null
            && path.startsWith(TRUSTED_PATH);
    }

    private class AndroidBridge {
        @JavascriptInterface
        public void setLandscape(boolean landscape) {
            if (webView == null) return;
            Uri currentUri = Uri.parse(webView.getUrl() == null ? "" : webView.getUrl());
            if (!isTrustedGameUri(currentUri)) return;
            runOnUiThread(() -> setRequestedOrientation(
                landscape
                    ? ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
                    : ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
            ));
        }
    }

    private void handleBackNavigation() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else finish();
    }

    @SuppressLint("GestureBackNavigation")
    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        handleBackNavigation();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.removeJavascriptInterface("AndroidApp");
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
