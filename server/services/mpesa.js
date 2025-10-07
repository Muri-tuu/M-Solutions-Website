import axios from 'axios';

function base64(str){ return Buffer.from(str).toString('base64'); }

async function getAccessToken(){
  const key = process.env.CONSUMER_KEY;
  const secret = process.env.CONSUMER_SECRET;
  const auth = base64(`${key}:${secret}`);
  const res = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
}

export async function initiateStkPush({ phone, amount, orderId }){
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const shortcode = process.env.BUSINESS_SHORTCODE || '174379';
  const passkey = process.env.LIPA_PASSKEY;
  const password = base64(`${shortcode}${passkey}${timestamp}`);
  const callbackURL = `${process.env.PUBLIC_URL}/api/mpesa/callback`;

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(amount),
    PartyA: phone,
    PartyB: shortcode,
    PhoneNumber: phone,
    CallBackURL: callbackURL,
    AccountReference: `${orderId}`,
    TransactionDesc: 'M Solutions Order Payment'
  };

  const res = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
