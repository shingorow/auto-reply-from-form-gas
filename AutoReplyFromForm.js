/**
 * フォームで登録されたメールアドレスにメールを送る
 *
 * @param {Object} response Form の Response オブジェクト
 * @param {Object} config スクリプトで使用する Config
 */
function send(response, config) {
  var formData = getPostDataFromForm_(response);
  var emailMessageTemplate = getEmailMessageTemplate_(config.docId);
  var emailMessage = createEmailMessage_(emailMessageTemplate, formData);
  sendEmail_(formData, emailMessage, config);
}


/**
 * フォームから送信されたデータを取得する
 *
 * @param {Object} response フォームから送られた Response データ
 *
 * @return {Object} Input のタイトルをキーとしたデータオブジェクト
 */
var getPostDataFromForm_ = function(response) {
  var formData = {};
  var itemResponses = response.getItemResponses();
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    
    // Form から送信されたデータのラベルを Key、入力内容を Value にした辞書を作成する
    formData[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
  }

  return formData;
}


/**
 * Email メッセージのテンプレートを取得する
 *
 * @param {string} docId テンプレートになるドキュメントの ID
 *
 * @return {Object} タイトルと本文を含むオブジェクト
 */
var getEmailMessageTemplate_ = function(docId) {
  var doc, subject, body, template;
  
  if (docId) {
    doc = DocumentApp.openById(docId);
    subject = doc.getName();
    body = doc.getBody().getText();
    template = {
      subject: subject,
      body: body
    }
  }

  return template; 
}


/**
 * テンプレートから Email のメッセージを作成する
 *
 * @param {string} template Email のテンプレート文字列
 * @param {Object} formData フォームに入力されてたデータのハッシュ
 *
 * @return {string} Email タイトルとメッセージ本文を含むオブジェクト
 */
var createEmailMessage_ = function(template, formData) {
  var obj, re, message = {}, subject, body, openReplaceTag = '{{', closeReplaceTag = '}}';
  if (template) {
    subject = template.subject;
    body = template.body;
    
    for (var key in formData) {    
      // テンプレート文書にフォームの値を差し込む
      re = new RegExp(openReplaceTag + key + closeReplaceTag, 'g');
      body = body.replace(re, formData[key]);
    }
  }　else {
    // テンプレートが指定されていない場合のデフォルト文書
    subject = 'フォームへの登録が完了しました';
    body = '下記の内容で登録されました\n\n####################\n\n';
    for (var i in formData) {
      body += i + ": " + formData[i] + '\n';
    }
    
    body += '\n####################'
  }
  
  message['subject'] = subject;
  message['body'] = body;
  
  return message;
}


/**
 * メールを送信する
 *
 * @param {Object} formData フォームから送信されたデータ 
 * @param {Object} emailMessage Email のタイトルと本文を含むオブジェクト
 * @param {Object} config スクリプトを実行するためのコンフィグ
 * 
 */
var sendEmail_ = function(formData, emailMessage, config) {
  var recipient, options, subject, body, emailLabel;
  
  emailLabel = config.emailLabel || 'メールアドレス';
  recipient = formData[emailLabel];

  options = {}
  if (config.attachments) options['attachments'] = config.attachments;
  if (config.bcc) options['bcc'] = config.bcc;
  if (config.cc) options['cc'] = config.cc;
  if (config.from) options['from'] = config.from;
  if (config.htmlBody) options['htmlBody'] = config.htmlBody;
  if (config.inlineImage) options['inlineImage'] = config.inlineImage;
  if (config.name) options['name'] = config.name;
  if (config.noReply) options['noReply'] = config.noReply;
  if (config.replyTo) options['replyTo'] = config.replyTo;
  
  subject = emailMessage.subject;
  body = emailMessage.body;

  GmailApp.sendEmail(recipient, subject, body, options);
}
