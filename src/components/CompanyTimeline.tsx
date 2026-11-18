import styles from './CompanyTimeline.module.css';

const milestones = [
  ['1976', 'Book fairs and exhibitions', 'Chandra worked on the Book Fair and the Ideal Home Exhibition.'],
  ['1993', 'Sound, lighting and furniture', 'The team supplied audio, generators and wedding lighting, and expanded into furniture.'],
  ['1996', 'Pandals and structures', 'Chandra expanded into pandals and temporary structures.'],
  ['1999 onward', 'IIT Convocation', 'The team began working on IIT Convocation.'],
  ['2000–2003', 'Building the exhibition floor', 'Modular wooden flooring arrived in 2000, German structures in Chennai in 2001, and temporary air-conditioning in 2002. In 2003 the team added exhibition stalls, Octanorm partitions and parabolic steel structures.'],
  ['2010', 'Senthamizh Maanaadu', 'Chandra supported internet connectivity for the Tamil conference.'],
  ['2015–2020', 'More than 2,000 events', 'Chandra delivered more than 2,000 events during this period. In 2018 the team added 33-ton air-conditioning for events.'],
  ['2020–2022', 'Temporary wards', 'During the pandemic, Chandra built air-conditioned temporary wards using German structures, including at Kilpauk and Stanley. In 2021 the team also supplied structures for campaigns across several districts.'],
  ['2022–2026', 'District book fairs', 'The team delivered district book fairs across this period.'],
  ['2023', 'Concert production', 'Chandra added concert lighting, trusses and ring-lock scaffolding.'],
  ['2025', 'TNPL gallery', 'Chandra engineered the TNPL gallery.'],
  ['2026', 'Dubai and Dharmapuri', 'Chandra expanded into Dubai. The year also included TVK’s Dharmapuri Maanaadu and plans to mark 50 years of the Book Fair.'],
] as const;

export function CompanyTimeline() {
  return (
    <section id="timeline" className={styles.section} aria-labelledby="company-timeline-heading">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h2 id="company-timeline-heading">Our timeline</h2>
          <p>From book fairs and wedding lighting to exhibition halls and concert stages.</p>
        </header>
        <ol className={styles.list} role="list">
          {milestones.map(([year, title, detail]) => (
            <li key={year} className={styles.entry}>
              <div className={styles.copy}>
                <span className={styles.year}>{year}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
