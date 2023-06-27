
class AppRecipeForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `    
                <form id="createRecipeForm">
                    <div id="formTitle"></div>
                    <div id="drop-area">
                      <div class="drop-area__prompt">Drag and drop files here or click to upload</div>
                      <div id="file-list"></div>
                    </div>
                    <div>
                        <label id="recipeTitle" for="title">
                            <input id="title" type="text" required placeholder="Please enter the title here">
                        </label>
                    </div>
                    <div id="ingredientsDiv" class="addDiv">
                        <label id="ingredientsLabel">Ingredients: </label>
                        <a href="#" id="ingredientsAdd" class="add">+</a>
                    </div>
                    <div id="ingredientsInputDiv"></div>
                    <div id="methodDiv" class="addDiv">
                        <label>Steps:</label>
                        <a href="#" id="methodAdd" class="add">+</a>
                    </div>
                    <div id="methodInputDiv"></div>
                    <div class="timeToMakeDiv">
                        <label for="timeToMake">
                            <span>time to cook: </span>
                            <input id="timeToMake" required type="number">
                            <span> minutes</span>
                        </label>
                    </div>
                    <div id="dropdown" class="dropdownDiv">
                      <button id="dropdown-button" class="dropdown-button">Enter difficulty</button>
                      <div class="dropdown-content" id="dropdown-content">
                        <a href="#">easy</a>
                        <a href="#">medium</a>
                        <a href="#">hard</a>
                      </div>
                    </div>
                    <div>
                        <span>tags:</span>
                        <label id="chosenTags" class="chosenTags">
            
                        </label>
                    </div>
                    <div id="tags" class="dropdownDiv">
                        <input type="text" id="tagsInput" placeholder="add your tags here">
                    </div>
                    <input type="button" id="submitButton" value="create recipe">
            
                </form>
            `
    }
}

customElements.define("app-recipe-form", AppRecipeForm);