import { useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { post } from '../api';
import { useStore } from '../store';
import { Button, FormField, PageHeader } from '../components/UI';
import '../account.css';

export default function TwoFactorPage() {
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState('');
  const [backup, setBackup] = useState([]);
  const setToast = useStore(s => s.setToast);

  async function start() {
    try {
      const result = await post('/security/2fa/setup', {});
      setSetup(result.data);
    } catch (e) {
      setToast(e.message);
    }
  }

  async function enable(e) {
    e.preventDefault();
    try {
      const result = await post('/security/2fa/enable', { code });
      setBackup(result.backupCodes);
      setToast('2FA সক্রিয় হয়েছে');
    } catch (e) {
      setToast(e.message);
    }
  }

  return (
    <>
      <PageHeader
        icon={KeyRound}
        title="Admin 2FA Setup"
        subtitle="Authenticator app দিয়ে account সুরক্ষিত করুন"
      />

      <section className="panel twofa-panel">
        {!setup ? (
          <>
            <p>Admin account-এর জন্য TOTP দুই ধাপের নিরাপত্তা চালু করুন।</p>
            <Button icon={ShieldCheck} onClick={start}>Setup শুরু করুন</Button>
          </>
        ) : (
          <>
            <h3>QR Code scan করুন</h3>
            <img className="twofa-qr" src={setup.qrCode} alt="Authenticator QR code" />
            <p>তারপর authenticator code লিখুন। Secret: <b>{setup.secret}</b></p>

            <form onSubmit={enable}>
              <FormField label="৬ সংখ্যার code">
                <input
                  required
                  inputMode="numeric"
                  maxLength="6"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
              </FormField>
              <Button type="submit">2FA সক্রিয় করুন</Button>
            </form>

            {backup.length > 0 && (
              <div className="backup-codes">
                <h3>Backup codes সংরক্ষণ করুন</h3>
                {backup.map(item => (
                  <code key={item}>{item}</code>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}