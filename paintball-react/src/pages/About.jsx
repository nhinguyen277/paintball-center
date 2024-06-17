import styles from "../css/styles.module.css";
export default function About() {
  return (
    <>
      <div className={styles.container}>
        <h1>ABOUT US</h1>
        <div className={styles.aboutContent}>
          <h3>
            Welcome to Epic Paintball Adventures, the ultimate destination for
            thrill-seekers and paintball enthusiasts, conveniently located in
            the heart of Toronto! Established in 2024, our paintball center
            boasts a sprawling outdoor arena amidst the vibrant cityscape,
            offering a variety of exhilarating game zones designed to challenge
            and excite players of all skill levels. Whether you're a seasoned
            pro or a first-timer, our state-of-the-art equipment, expert staff,
            and meticulously crafted battlegrounds promise an unforgettable
            experience. With diverse game scenarios, from tactical missions to
            all-out team battles, Epic Paintball Adventures is perfect for
            birthday parties, corporate team-building events, or just a fun day
            out with friends. Come and immerse yourself in the action-packed
            world of paintball and create epic memories that will last a
            lifetime.
          </h3>
        </div>
      </div>
    </>
  );
}
