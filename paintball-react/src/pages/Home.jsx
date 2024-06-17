import styles from "../css/styles.module.css";
import banner from "../img/back2.png";
import post1 from "../img/blackbox1.jpg";
import post2 from "../img/rescue.webp";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.banner}>
          <img className={styles.imgBanner} src={banner} alt="banner" />
          <div className={styles.titleBanner}>
            <h2>Start Your Adventures Now!</h2>
            <Link to="/explore" className={styles.explore}>
              Explore
            </Link>
          </div>
        </div>
        <div className={styles.intro}>
          <div className={styles.flag}>
            <h2>
              At Epic Paintball Adventures, we bring excitement and action to
              life with our immersive paintball experiences. Whether you're a
              seasoned pro or a first-time player, our state-of-the-art
              facilities and diverse scenarios offer the ultimate battleground
              for everyone. Gear up, strategize with your team, and dive into
              thrilling missions that test your skills and teamwork. Adventure,
              fun, and unforgettable memories await you at Epic Paintball
              Adventures!
            </h2>
          </div>
        </div>
        <div className={styles.content}>
          <h1>
            Thrilling Scenarios Await: Dive into the Ultimate Paintball
            Experience!
          </h1>
          <div className={styles.post}>
            <img className={styles.imgPost} src={post1} alt="blackbox" />
            <div className={styles.shortDes}>
              <div className={styles.decript}>
                <h2>Black Box Game</h2>
                <h4>
                  Your team lost the black box during the mission, and it has
                  unfortunately fallen into enemy hands. You must retrieve the
                  black box before your army's secrets are decoded and exposed.
                  Prepare for a fierce battle with unwavering determination.
                </h4>
              </div>
              <Link to="/explore" className={styles.explore}>
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.post}>
            <div className={styles.shortDes}>
              <div className={styles.decript}>
                <h2>Hostage/Rescue</h2>
                <h4>
                  Your mission is critical. One of your teammates has been
                  captured by the enemy and is being held in a secure location.
                  Gather your squad, strategize your approach, and execute a
                  daring rescue operation. Every second counts, and teamwork is
                  essential.
                </h4>
              </div>
              <Link to="/explore" className={styles.explore}>
                Explore
              </Link>
            </div>
            <img className={styles.imgPost} src={post2} alt="blackbox" />
          </div>
        </div>
      </div>
    </>
  );
}
