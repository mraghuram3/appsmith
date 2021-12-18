const datasource = require("../../../../locators/DatasourcesEditor.json");
const queryEditor = require("../../../../locators/QueryEditor.json");
const datasourceEditor = require("../../../../locators/DatasourcesEditor.json");

let datasourceName;

describe("Arango datasource test cases", function() {
  beforeEach(() => {
    cy.startRoutesForDatasource();
  });

  it("1. Create, test, save then delete a Arango datasource", function() {
    cy.NavigateToDatasourceEditor();
    cy.get(datasource.ArangoDB).click();
    cy.getPluginFormsAndCreateDatasource();

    cy.fillArangoDBDatasourceForm();
    cy.generateUUID().then((UUID) => {
      datasourceName = `Arango MOCKDS ${UUID}`;
      cy.renameDatasource(datasourceName);
    });

    cy.get("@createDatasource").then((httpResponse) => {
      datasourceName = httpResponse.response.body.data.name;
    });
    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.testSaveDatasource(false);
  });

  it("2. Create with trailing white spaces in host address and database name, test, save then delete a Arango datasource", function() {
    cy.NavigateToDatasourceEditor();
    cy.get(datasource.ArangoDB).click();
    cy.getPluginFormsAndCreateDatasource();
    cy.fillArangoDBDatasourceForm(true);
    cy.get("@saveDatasource").then((httpResponse) => {
      datasourceName = httpResponse.response.body.data.name;
    });
    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.testSaveDatasource(false);
  });

  it("3. Create a new query from the datasource editor", function() {
    cy.saveDatasource();
    // cy.get(datasource.createQuerty).click();
    cy.get(`${datasourceEditor.datasourceCard} ${datasource.createQuerty}`)
      .last()
      .click();
    cy.wait("@createNewApi").should((interception) => {
      expect(interception.response.body.responseMeta.status).to.deep.eq(201);
    });

    cy.get(queryEditor.queryMoreAction).click();
    cy.get(queryEditor.deleteUsingContext).click();
    cy.wait("@deleteAction").should((interception) => {
      expect(interception.response.body.responseMeta.status).to.deep.eq(200);
    });

    cy.deleteDatasource(datasourceName);
  });
});
