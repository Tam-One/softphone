package com.brekeke.phonedev;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.Nullable;

public class IncomingCallActivity extends Activity {
  private MediaPlayer mp;

  private void startRingtone() {
    Context ctx = getApplicationContext();
    AudioManager am = ((AudioManager) ctx.getSystemService(Context.AUDIO_SERVICE));
    am.setMode(AudioManager.MODE_RINGTONE);

    AudioAttributes attr =
        new AudioAttributes.Builder()
            .setContentType(AudioAttributes.CONTENT_TYPE_UNKNOWN)
            .setLegacyStreamType(AudioManager.STREAM_RING)
            .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
            .build();
    int id = am.generateAudioSessionId();

    mp = MediaPlayer.create(ctx, R.raw.incallmanager_ringtone, attr, id);
    mp.setVolume(1.0f, 1.0f);
    mp.setLooping(true);
    mp.start();
  }

  private void forceStopRingtone() {
    try {
      mp.stop();
      mp.release();
    } catch (Exception e) {
    }
  }

  private Boolean closed = false;
  private Boolean closedWithAnswerPressed = false;

  private void forceFinish() {
    closed = true;
    try {
      finishAndRemoveTask();
    } catch (Exception e) {
      checkAndEmitShowCall();
    }
  }

  private void checkAndEmitShowCall() {
    if (closedWithAnswerPressed) {
      ((KeyguardManager) getApplicationContext().getSystemService(Context.KEYGUARD_SERVICE))
          .requestDismissKeyguard(this, new KeyguardManager.KeyguardDismissCallback() {});
      IncomingCallModule.emit("showCall", "");
    }
  }

  public Boolean closeIncomingCallActivity(Boolean isAnswerPressed) {
    if (closed) {
      return true;
    }
    closedWithAnswerPressed = isAnswerPressed;

    // TODO test behavior of this case
    Boolean requestUnlockOnAnswer = true;
    if (requestUnlockOnAnswer) {
      forceFinish();
      return true;
    }

    if (!isAnswerPressed
        || !((KeyguardManager) getApplicationContext().getSystemService(Context.KEYGUARD_SERVICE))
            .isDeviceLocked()) {
      forceFinish();
      return true;
    }
    Button btnAnswer = (Button) findViewById(R.id.btn_answer);
    if (btnAnswer != null) {
      ViewGroup goBackBtnLayout = (ViewGroup) btnAnswer.getParent();
      goBackBtnLayout.removeView(btnAnswer);
    }
    Button btnReject = (Button) findViewById(R.id.btn_reject);
    if (btnReject != null) {
      ViewGroup triggerAlertBtnLayout = (ViewGroup) btnReject.getParent();
      triggerAlertBtnLayout.removeView(btnReject);
    }
    forceStopRingtone();
    return false;
  }

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    startRingtone();

    if (IncomingCallModule.activity != null) {
      IncomingCallModule.activity.closeIncomingCallActivity(false);
    }
    IncomingCallModule.activity = this;

    Bundle b = getIntent().getExtras();
    if (b == null) {
      b = savedInstanceState;
    }
    if (b == null) {
      closeIncomingCallActivity(false);
      return;
    }

    setContentView(R.layout.incoming_call_activity);
    getWindow()
        .addFlags(
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
                | WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);

    String uuid = b.getString("uuid");
    String callerName = b.getString("callerName");
    String callerNumber = b.getString("callerNum");
    Button btnCallerName = (Button) findViewById(R.id.btn_caller_name);
    TextView txtCallerName = (TextView) findViewById(R.id.txt_caller_name);
    if(callerName.trim().isEmpty() || callerName.equals(callerNumber)){
      txtCallerName.setVisibility(View.GONE);
      btnCallerName.setVisibility(View.GONE);
    } else {
      txtCallerName.setText(callerName);
      StringBuilder initials = new StringBuilder();
      for (String s : callerName.split(" ")) {
        initials.append(s.charAt(0));
      }
      if(initials.length() < 2){
        initials.append(callerName.charAt(1));
      }
      btnCallerName.setText(initials);
    }
    TextView txtCallerNumber = (TextView) findViewById(R.id.txt_caller_number);
    txtCallerNumber.setText(callerNumber);
    Boolean isVideoCall = b.getBoolean("isVideoCall");

    findViewById(R.id.btn_answer)
        .setOnClickListener(
            new View.OnClickListener() {
              @Override
              public void onClick(View v) {
                closeIncomingCallActivity(true);
                IncomingCallModule.emit("answerCall", uuid);
              }
            });
    findViewById(R.id.btn_reject)
        .setOnClickListener(
            new View.OnClickListener() {
              @Override
              public void onClick(View v) {
                closeIncomingCallActivity(false);
                IncomingCallModule.emit("rejectCall", uuid);
              }
            });

  }

  @Override
  protected void onPause() {
    // On home button press
    // TODO it is now taking ~5s until main rn app open, we'll try improve this later
    if (closedWithAnswerPressed) {
      forceFinish();
    }
    super.onPause();
  }

  @Override
  protected void onDestroy() {
    checkAndEmitShowCall();
    forceStopRingtone();
    super.onDestroy();
  }
}
