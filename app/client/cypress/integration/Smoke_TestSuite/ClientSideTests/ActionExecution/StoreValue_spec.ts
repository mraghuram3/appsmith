import { ObjectsRegistry } from "../../../../support/Objects/Registry";

const { AggregateHelper: agHelper, JSEditor: jsEditor } = ObjectsRegistry;

describe("storeValue Action test", () => {
  before(() => {
    //
  });

  it("1. Bug 14653: Running consecutive storeValue actions and await", function() {
    const jsObjectBody = `export default {
      myFun1: () => {
        let values =
          [
            storeValue('val1', 'number 1'),
            storeValue('val2', 'number 2'),
            storeValue('val3', 'number 3'),
            storeValue('val4', 'number 4')
          ]
        return Promise.all(values)
          .then(() => {
            showAlert(JSON.stringify(appsmith.store))
        })
          .catch((err) => {
            return showAlert('Could not store values in store ' + err.toString());
          })
      }
    }`;

    jsEditor.CreateJSObject(jsObjectBody, {
      paste: true,
      completeReplace: true,
      toRun: false,
      shouldCreateNewJSObj: true,
    });

    // Add wait time as parsing JSOject takes time
    agHelper.GetNClick(jsEditor._runButton, 0, false, 6000);

    agHelper.ValidateToastMessage(
      JSON.stringify({
        val1: "number 1",
        val2: "number 2",
        val3: "number 3",
        val4: "number 4",
      }),
      2,
    );
  });
});
