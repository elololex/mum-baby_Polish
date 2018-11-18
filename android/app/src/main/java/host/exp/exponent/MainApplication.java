package host.exp.exponent;


import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.List;

import expolib_v1.okhttp3.OkHttpClient;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.airship.customwebview.CustomWebViewPackage;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;

public class MainApplication extends ExpoApplication implements ShareApplication {

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        // TODO: add native modules!

        // Needed for `react-native link`
        // new MainReactPackage(),
            new RNSharePackage(),
            new CustomWebViewPackage(),
            new RCTPdfView(),
            new RNFetchBlobPackage(),
            new RNHTMLtoPDFPackage()
    );
  }

  @Override
  public String getFileProviderAuthority() {
    return "com.imagineear.mumandbabypolish.provider";
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  @Override
  public boolean shouldUseInternetKernel() {
    return BuildVariantConstants.USE_INTERNET_KERNEL;
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }
}
