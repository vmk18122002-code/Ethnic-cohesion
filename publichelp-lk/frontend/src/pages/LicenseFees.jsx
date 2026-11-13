import { useEffect, useState } from 'react';
import { api, lkr } from '../api.js';
import { Loader, Page, SourceBox } from '../components/ui.jsx';
import { useLang } from '../context/LangContext.jsx';

export default function LicenseFees() {
  const { t, lang } = useLang();
  const [table, setTable] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/license/fees?lang=${lang}`).then(setTable).catch((e) => setError(e.message));
    api(`/license/meta?lang=${lang}`).then(setMeta).catch(() => {});
  }, [lang]);

  if (error) return <Page><div className="alert alert-error">{error}</div></Page>;
  if (!table) return <Loader />;

  return (
    <Page>
      <div className="detail-layout" style={{ marginTop: 0, gridTemplateColumns: 'minmax(0,1fr) 380px' }}>
        <div className="stack gap-24">
          <section className="card">
            <div className="card-pad" style={{ paddingBottom: 8 }}><h3 style={{ fontSize: 18 }}>{t('officialFeeTable')}</h3></div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>{t('colService')}</th><th>{t('colFee')} (normal)</th><th>{t('colFee')} (same day)</th></tr></thead>
                <tbody>
                  {table.fees.services.map((s) => (
                    <tr key={s.key}>
                      <td>{s.label}</td>
                      <td className="amount">{lkr(s.normal)}</td>
                      <td className="amount">{s.urgent ? lkr(s.urgent) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {meta?.vehicleClasses && (
            <section className="card">
              <div className="card-pad" style={{ paddingBottom: 8 }}><h3 style={{ fontSize: 18 }}>{t('vehicleClassesTitle')}</h3></div>
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Class</th><th>{t('colNote')}</th></tr></thead>
                  <tbody>
                    {meta.vehicleClasses.map((v) => (
                      <tr key={v.key}><td><b>{v.label}</b></td><td className="muted">{v.detail}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <aside className="sticky-col">
          <SourceBox source={table.source} />
        </aside>
      </div>
    </Page>
  );
}
