import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { projectSavingsBand } from "../../lib/passport-savings-projection";
import "./Learn.css";

function money(value: number) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/**
 * Deliberately starts empty. We have no approved spending, discount, or
 * utilization assumptions (see docs/product/PASSPORT-SAVINGS-IMPACT-MODEL.md),
 * so prefilling this would amount to publishing an invented statistic.
 */
export function SavingsExplorer() {
  const [monthlySpend, setMonthlySpend] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [utilizationPercent, setUtilizationPercent] = useState("");
  const [years, setYears] = useState("15");

  const ready =
    monthlySpend.trim() !== "" &&
    discountPercent.trim() !== "" &&
    utilizationPercent.trim() !== "";

  const band = useMemo(
    () =>
      projectSavingsBand({
        monthlySpend: Number(monthlySpend),
        discountRate: Number(discountPercent) / 100,
        utilization: Number(utilizationPercent) / 100,
        years: Number(years),
      }),
    [monthlySpend, discountPercent, utilizationPercent, years],
  );

  return (
    <div className="learnPage">
      <section className="learnHero">
        <div className="learnWrap">
          <span className="learnEyebrow">
            <Calculator /> Savings explorer
          </span>
          <h1>See what your own numbers add up to.</h1>
          <p className="learnLead">
            We do not publish an average, because we have not finished the
            research to support one. Enter what is true for your household and
            this will do the arithmetic — nothing more.
          </p>
        </div>
      </section>

      <section className="learnCalcSection">
        <div className="learnWrap learnCalcLayout">
          <form
            className="learnCalcForm"
            aria-label="Savings assumptions"
            onSubmit={(event) => event.preventDefault()}
          >
            <label>
              <span>What do you spend on your pet each month?</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                placeholder="e.g. 120"
                value={monthlySpend}
                onChange={(event) => setMonthlySpend(event.target.value)}
              />
            </label>
            <label>
              <span>Average discount you expect to get (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                inputMode="decimal"
                placeholder="e.g. 10"
                value={discountPercent}
                onChange={(event) => setDiscountPercent(event.target.value)}
              />
            </label>
            <label>
              <span>Share of that spending where an offer applies (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                inputMode="decimal"
                placeholder="e.g. 40"
                value={utilizationPercent}
                onChange={(event) => setUtilizationPercent(event.target.value)}
              />
            </label>
            <label>
              <span>Years to project</span>
              <input
                type="number"
                min="1"
                max="25"
                value={years}
                onChange={(event) => setYears(event.target.value)}
              />
            </label>
          </form>

          <div className="learnCalcResults" aria-live="polite">
            {!ready ? (
              <p className="learnCalcPlaceholder">
                Fill in the three fields on the left and your figures will
                appear here.
              </p>
            ) : (
              <>
                <table className="learnCalcTable">
                  <caption>
                    Illustrative estimate from the figures you entered
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Scenario</th>
                      <th scope="col">Per month</th>
                      <th scope="col">First year</th>
                      <th scope="col">{band.base.years} years</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        Lower
                        <small>Half the offer use you estimated</small>
                      </th>
                      <td>{money(band.low.perMonth)}</td>
                      <td>{money(band.low.firstYear)}</td>
                      <td>{money(band.low.fullTerm)}</td>
                    </tr>
                    <tr className="learnCalcBase">
                      <th scope="row">
                        As entered
                        <small>Your own figures</small>
                      </th>
                      <td>{money(band.base.perMonth)}</td>
                      <td>{money(band.base.firstYear)}</td>
                      <td>{money(band.base.fullTerm)}</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        Higher
                        <small>Half again more offer use</small>
                      </th>
                      <td>{money(band.high.perMonth)}</td>
                      <td>{money(band.high.firstYear)}</td>
                      <td>{money(band.high.fullTerm)}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="learnCalcNote">
                  <Info />
                  <span>
                    This is arithmetic on your inputs, not a prediction, an
                    offer, or a record of money saved. It assumes no price
                    changes over time and does not account for inflation.
                    Participating offers set their own terms and availability,
                    and offers change.
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="learnCalcFooterSection">
        <div className="learnWrap learnFaqTeaserInner">
          <div>
            <h2>Why there is no number here by default</h2>
            <p>
              Publishing a savings average we have not researched would be
              inventing a statistic. When the underlying spending and
              utilization research is finished and reviewed, illustrative
              scenarios will be published with their sources and dates attached.
            </p>
          </div>
          <Link className="learnButton" to="/learn/savings">
            How we think about savings <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
