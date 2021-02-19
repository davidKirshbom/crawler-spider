import "./styles/styles.scss";
import React, { useReducer } from "react";
import formReducer from "./reducer/formReducer";
import { crawler } from "./server/crawler";
import ResultTable from "./components/ResultTable";
import MessageModal from "./components/MessageModal";
import WaitingSpinner from "./components/WaitingSpinner";
function App() {
  const [formState, formDispatch] = useReducer(formReducer, { errors: {} });
  const handleFormValidation = (form) => {
    const errors = {};
    formDispatch({ type: "start_validation" });
    const maxDepth = parseInt(form["max-depth"].value);
    const maxPages = parseInt(form["max-pages"].value);
    if (!maxDepth) errors.maxDepth = true;
    if (!maxPages) errors.maxPages = true;
    if (form["url"] === "") errors.url = true;
    if (Object.keys(errors).length > 0) {
      formDispatch({ type: "validation_error", errors });
      return false;
    } else {
      formDispatch({ type: "validation_success" });
      return true;
    }
  };
  const ProcessForm = async (e) => {
    e.preventDefault();

    const form = e.target;
    if (handleFormValidation(form)) {
      formDispatch({ type: "form_sended" });
      try {
        const crawlerData = await crawler(
          form["url"].value,
          form["max-depth"].value,
          form["max-pages"].value
        );
        formDispatch({ type: "form_result_success", data: crawlerData });
      } catch (err) {
        console.log(err.response);
        formDispatch({
          type: "form_result_failed",
          errors: { resultFail: true, message: err.response.data },
        });
      }
    }
  };
  return (
    <div className="app">
      <div className="background"></div>
      <header className="App-header">
        <h1 className="title">Spider Crawler</h1>
      </header>
      <body>
        {formState.isLoading && <WaitingSpinner />}
        {formState.errors && formState.errors.resultFail && (
          <MessageModal
            closeFunc={() =>
              formDispatch({
                type: "init",
              })
            }
          >
            <p className="modal-content">{formState.errors.message}</p>
          </MessageModal>
        )}
        <div className="form-container">
          <form onSubmit={ProcessForm} className="crawler-form">
            <div className="input-container">
              <label htmlFor="url-input" className="input-title">
                Url:
              </label>
              <input id="url-input" name="url" type="text" />
              {formState.errors && formState.errors.url && (
                <div className="error">page not available</div>
              )}
            </div>
            <div className="input-container">
              <label htmlFor="max-depth-input" className="input-title">
                Max depth:
              </label>
              <input id="max-depth-input" name="max-depth" type="text" />
              {formState.errors && formState.errors.maxDepth && (
                <div className="error">Needs to be a number</div>
              )}
            </div>
            <div className="input-container">
              <label htmlFor="max-pages-input" className="input-title">
                Max pages:
              </label>
              <input id="max-pages-input" name="max-pages" type="text" />
              {formState.errors && formState.errors.maxPages && (
                <div className="error">Needs to be a number</div>
              )}
            </div>
            <div className="btn-container">
              <button
                className="submit-btn"
                type="submit"
                disabled={formState.isLoading}
              >
                let the spider out
              </button>
            </div>
          </form>
        </div>
        <div className="result-section">
          {formState.data && (
            <ResultTable
              data={formState.data}
              numberOfColumns={formState.data.reduce(
                (max, currentPage) =>
                  max < currentPage.depth ? currentPage.depth : max,
                0
              )}
            />
          )}
        </div>
      </body>
    </div>
  );
}

export default App;
