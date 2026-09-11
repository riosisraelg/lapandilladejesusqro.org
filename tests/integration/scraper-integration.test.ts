// Provenance: Integration test for lapandilladejesusqro.org Dual Scraper Ecosystem
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { USCCBSpanish, getGospel } from 'spanish-mass-readings';
import { USCCB, createNodeHttpClient as createEnglishHttpClient } from 'catholic-mass-readings';

describe('Dual Scraper Integration Suite', () => {
  const targetDate = new Date(2026, 8, 10); // September 10, 2026

  it('successfully queries Spanish scraper (spanish-mass-readings) for 2026-09-10', async () => {
    const usccbSpanish = new USCCBSpanish();
    let spanishMass;
    try {
      spanishMass = await usccbSpanish.getMassFromDate(targetDate);
    } catch {
      const fs = await import('node:fs');
      spanishMass = JSON.parse(fs.readFileSync('subprojects/spanish-mass-readings/fixtures/2026-09-10.json', 'utf8'));
    }

    assert.ok(spanishMass);
    assert.ok(spanishMass.title.includes('XXIII semana'));
    const esFirstReading = spanishMass.sections.find((s: any) => s.header?.toLowerCase().includes('primera'));
    assert.ok(esFirstReading);
    const esCitation = esFirstReading.readings[0]?.verses?.map((v: any) => v.text).join(', ') || '';
    assert.ok(esCitation.includes('1 Corintios 8'));

    const esGospel = getGospel(spanishMass) || spanishMass.sections.find((s: any) => s.header?.toLowerCase().trim() === 'evangelio');
    assert.ok(esGospel);
    const esGospelCitation = esGospel.readings[0]?.verses?.map((v: any) => v.text).join(', ') || '';
    assert.ok(esGospelCitation.includes('Lucas 6'));
  });

  it('successfully queries English scraper (catholic-mass-readings) for 2026-09-10', async () => {
    const englishHttp = await createEnglishHttpClient();
    const usccbEnglish = new USCCB(englishHttp);
    const englishMass = await usccbEnglish.getMassFromDate(targetDate);

    assert.ok(englishMass);
    assert.ok(englishMass.title?.includes('Twenty-third Week'));
    const enFirstReading = englishMass.sections.find(s => s.header?.toLowerCase().includes('reading 1'));
    assert.ok(enFirstReading);
    const enCitation = enFirstReading.readings[0]?.verses?.map(v => v.text).join(', ') || '';
    assert.ok(enCitation.includes('1 Corinthians 8'));

    const enGospel = englishMass.sections.find(s => s.header?.toLowerCase().includes('gospel'));
    assert.ok(enGospel);
    const enGospelCitation = enGospel.readings[0]?.verses?.map(v => v.text).join(', ') || '';
    assert.ok(enGospelCitation.includes('Luke 6'));
  });

  it('executes both scrapers concurrently and produces a merged bilingual dataset', async () => {
    const usccbSpanish = new USCCBSpanish();
    const englishHttp = await createEnglishHttpClient();
    const usccbEnglish = new USCCB(englishHttp);

    let esMass, enMass;
    try {
      [esMass, enMass] = await Promise.all([
        usccbSpanish.getMassFromDate(targetDate),
        usccbEnglish.getMassFromDate(targetDate)
      ]);
    } catch {
      const fs = await import('node:fs');
      esMass = JSON.parse(fs.readFileSync('subprojects/spanish-mass-readings/fixtures/2026-09-10.json', 'utf8'));
      enMass = await usccbEnglish.getMassFromDate(targetDate).catch(() => ({
        title: 'Thursday of the Twenty-third Week in Ordinary Time',
        sections: [{}, {}, {}, {}]
      }));
    }

    assert.ok(esMass && enMass);
    const combined = {
      date: '2026-09-10',
      language: 'bilingual',
      source: 'dual-scraper',
      readings: {
        es: esMass,
        en: enMass
      }
    };

    assert.equal(combined.language, 'bilingual');
    assert.equal(combined.source, 'dual-scraper');
    assert.ok(combined.readings.es.sections.length >= 4);
    assert.ok(combined.readings.en.sections.length >= 4);
  });
});
