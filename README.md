# Auto reply email script for Google Forms
Google Forms でフォーム送信時に登録したメールアドレス宛にメールを送信する Google Apps Script

Google Apps Script Project Key: MVmb-M4ySRz0LLn941DdUGrFSwZrFpnJA

---
このプログラムを使用して起きた問題に関して当方は一切責任を負いません。
## 使用例
```javascript
function onSubmit(e) {
  var config = {
    docId: '', // テンプレートとして使用する Google Document ファイルの ID
    emailLabel: 'Email', // フォーム上のメールアドレス入力欄のラベル (デフォルトは 'メールアドレス')
    name: '送り主太郎',
    from: 'sender@example.com',
  }

  AutoReplyFromForm(e.response, config);
}
```
config の docId と emailLabel 以外は GmailApps の options の項目を設定できます。

[Class GmailApp  |  Apps Script  |  Google Developers](https://developers.google.com/apps-script/reference/gmail/gmail-app#sendemailrecipient-subject-body-options)
