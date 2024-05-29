import styles from "../css/styles.module.css";
import Scenarios from "../components/ScenarioList";
import SideNav from "../components/SideNav";

export default function Scenario() {
  return (
    <>
      <div className={styles.adminContainer}>
        <SideNav />
        <div id="scenarioPart">
          <h1 className={styles.scenarioTitle}>All Scenarios</h1>
          <div id="scenarios" className={styles.scenarios}>
            <Scenarios />
          </div>
        </div>
      </div>
    </>
  );
}
