package com.brekeke.phonedev;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;
import androidx.annotation.NonNull;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import io.wazo.callkeep.RNCallKeepModule;

public class MainActivity extends ReactActivity {
  // ==========================================================================
  // set/unset BrekekeUtils.main
  @Override
  protected void onStart() {
    BrekekeUtils.main = this;
    super.onStart();
  }

  @Override
  protected void onResume() {
    super.onResume();
    Bundle b = getIntent().getExtras();
    if (b == null) {
      return;
    }
    String phone = b.getString("extra_phone");
    if (phone == null || phone.isEmpty()) {
      return;
    }
    if (BrekekeUtils.eventEmitter != null) {
      BrekekeUtils.emit("makeCall", phone);
      return;
    }
    Runnable r =
        new Runnable() {
          public void run() {
            BrekekeUtils.emit("makeCall", phone);
          }
        };
    Handler handler = new android.os.Handler();
    handler.postDelayed(r, 5000);
  }

  @Override
  protected void onDestroy() {
    BrekekeUtils.main = null;
    BrekekeUtils.staticStopRingtone();
    super.onDestroy();
  }

  // ==========================================================================
  // check if notification pressed
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  // ==========================================================================
  // stop ringtone on any press and custom back btn handler
  @Override
  public boolean dispatchKeyEvent(KeyEvent e) {
    int k = e.getKeyCode();
    int a = e.getAction();
    BrekekeUtils.emit("debug", "MainActivity.onKeyDown k=" + k + " a=" + a);
    // stop ringtone if any of the hardware key press
    BrekekeUtils.staticStopRingtone();
    // handle back btn press, remember that this event fire twice, down/up
    if (k == KeyEvent.KEYCODE_BACK || k == KeyEvent.KEYCODE_SOFT_LEFT) {
      if (a == KeyEvent.ACTION_DOWN) {
        BrekekeUtils.emit("onBackPressed", "");
      }
      return true;
    }
    return super.dispatchKeyEvent(e);
  }

  // ==========================================================================
  // react-native config
  @Override
  protected String getMainComponentName() {
    return "BrekekePhone";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this, getMainComponentName(), DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }

  @Override
  public void onRequestPermissionsResult(
      int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    switch (requestCode) {
      case RNCallKeepModule.REQUEST_READ_PHONE_STATE:
        RNCallKeepModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
        break;
    }
  }
}
