import styles from "../css/styles.module.css";
import { Link } from "react-router-dom";
import photo from "../img/i1.jpg";
import photo2 from "../img/i3.jpg";
export default function Explore() {
  return (
    <>
      <div className={styles.container}>
        <h1>Explore paintball</h1>
        <div className={styles.exploreImg}>
          <img className={styles.imgExplore} src={photo} alt="image1" />
          <img className={styles.imgExplore} src={photo2} alt="image2" />
        </div>
        <div className={styles.exploreContent}>
          <h4>
            Paintball is a competitive team shooting sport in which players
            eliminate opponents from play by hitting them with spherical
            dye-filled gelatin capsules called paintballs that break upon
            impact. Paintballs are usually shot using low-energy air weapons
            called paintball markers that are powered by compressed air or
            carbon dioxide and were originally designed for remotely marking
            trees and cattle.
          </h4>
          <h4>
            The game was invented in June 1981 in New Hampshire by Hayes Noel, a
            Wall Street stock trader, and Charles Gaines, an outdoorsman and
            writer. A debate arose between them about whether a city-dweller had
            the instinct to survive in the woods against a man who had spent his
            youth hunting, fishing, and building cabins. The two men chanced
            upon an advertisement for a paint gun in a farm catalogue and were
            inspired to use it to settle their argument with 10 other men all in
            individual competition, eventually creating the sport of paintball.
          </h4>
          <h4>
            The sport is played for recreation and is also played at a formal
            sporting level with organized competition that involves major
            tournaments, professional teams, and players. Games can be played on
            indoor or outdoor fields of varying sizes. A playing field may have
            natural or artificial terrain which players use for tactical cover.
            Game types and goals vary, but include capture the flag,
            elimination, defending or attacking a particular point or area, or
            capturing objects of interest hidden in the playing area. Depending
            on the variant played, games can last from minutes to hours, or even
            days in "scenario play". The legality of the sport and use of
            paintball markers varies among countries and regions. In most areas
            where regulated play is offered, players are required to wear
            protective masks, use barrel-blocking safety equipment, and strictly
            enforce safe game rules. The paintball equipment used may depend on
            the game type, for example: woodsball, speedball, or scenario; on
            how much money one is willing to spend on equipment; and personal
            preference. However, almost every player will utilize three basic
            pieces of equipment: Paintball marker: also known as a "paintball
            gun", this is the primary piece of equipment, used to mark the
            opposing player with paintballs. The paintball gun must have a
            loader or "hopper" or magazines attached to feed paint into the
            marker, and will be either spring-fed, gravity-fed (where balls drop
            into the loading chamber), or electronically force-fed. Modern
            markers require a compressed air tank or CO2 tank. In contrast, very
            early bolt-action paintball markers used disposable metal 12-gram
            (0.42 oz) CO2 cartridges also used by pellet guns. In the mid to
            late 1980s, marker mechanics improved to include constant air
            pressure and semi-automatic operation.Further improvements included
            increased rates of fire; carbon dioxide (CO2) tanks from 100 to
            1,180 ml (3.5 to 40 US fluid ounces), and compressed-air or nitrogen
            tanks in a variety of sizes and pressure capacities up to 34,000 kPa
            (5,000 psi). The use of unstable CO2 causes damage to the
            low-pressure pneumatic components inside electronic markers,
            therefore the more stable compressed air is preferred by owners of
            such markers.
          </h4>

          <h4>
            Paintballs (pellets): Paintballs, the ammunition used in the marker,
            are spherical gelatin capsules containing primarily polyethylene
            glycol, other non-toxic and water-soluble substances, and dye. The
            quality of paintballs is dependent on the brittleness of the ball's
            shell, the roundness of the sphere, and the thickness of the fill;
            higher-quality balls are almost perfectly spherical, with a very
            thin shell to guarantee breaking upon impact, and a thick, brightly
            colored fill that is difficult to hide or wipe off during the game.
            Almost all paintballs in use today are biodegradable. All
            ingredients used in the making of a paintball are food-grade quality
            and are harmless to the participants and environment. Manufacturers
            and distributors have been making the effort to move away from the
            traditional oil-based paints and compressed CO2 gas propellant, to a
            more friendly water-based formula and compressed air in an effort to
            become more "eco-friendly". Paintballs come in a variety of sizes,
            including of 13mm (0.50 in) and 17mm (0.68 in).
          </h4>
          <h4>
            Mask or goggles: Masks are safety devices players are required to
            wear at all times on the field, to protect them from paintballs. The
            original equipment used by players were safety goggles of the type
            used in labs and wood shops; today's goggles are derived from
            skiing/snowboarding goggles, with an attached shell that completely
            covers the eyes, mouth, ears and nostrils of the wearer. Masks can
            also feature throat guards. Modern masks have developed to be less
            bulky compared with older designs. Some players may remove the mouth
            and/or ear protection for aesthetic or comfort reasons, but this is
            neither recommended nor often allowed at commercial venues. A good
            paintball mask will protect the eyes from vision distortion caused
            by fogging, glare, and scratches. Players who do not wear a
            paintball mask can suffer serious injury.
          </h4>

          <h2 className={styles.bookingLink}>
            Explore today by registering an account:{" "}
            <Link to="../register">Register</Link>
          </h2>
        </div>
      </div>
    </>
  );
}
