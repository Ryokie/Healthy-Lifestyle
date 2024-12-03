// Login App
var loginApp = angular.module("loginApp", []);

loginApp.controller("LoginController", function ($scope, $http) {
    $scope.user = {};
    $scope.message = "";

    // Login function
    $scope.login = function () {
        $http.post("http://localhost:3001/login", $scope.user)
            .then(function (response) {
                $scope.message = response.data.message;
                if (response.status === 200) {
                    alert("Login berhasil!");
                    window.location.href = "users.html"; // Redirect to users page
                }
            })
            .catch(function (error) {
                $scope.message = error.data.message || "Login gagal!";
                console.error("Error:", error);
            });
    };

    // Register function
    $scope.register = function () {
        $http.post("http://localhost:3001/register", $scope.user)
            .then(function (response) {
                $scope.message = response.data.message;
                if (response.status === 201) {
                    alert("Registrasi berhasil! Silakan login.");
                    $scope.user = {}; // Clear form data
                }
            })
            .catch(function (error) {
                $scope.message = error.data.message || "Registrasi gagal!";
                console.error("Error:", error);
            });
    };
});

// Menu App
var menuApp = angular.module("menuApp", []);

// Directive for binding file input
menuApp.directive("fileModel", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("change", function () {
                scope.$apply(function () {
                    scope[attrs.fileModel] = element[0].files[0]; // Bind the file to scope
                });
            });
        }
    };
});

menuApp.controller("MenuController", function ($scope, $http) {
    $scope.menu = {};
    $scope.message = "";

    // Submit Form to add menu
    $scope.submitForm = function () {
        const formData = new FormData();
        formData.append("namaMakanan", $scope.menu.namaMakanan);
        formData.append("lamaPembuatan", $scope.menu.lamaPembuatan);
        formData.append("kkal", $scope.menu.kkal);
        formData.append("lemak", $scope.menu.lemak);
        formData.append("karbohidrat", $scope.menu.karbohidrat);
        formData.append("protein", $scope.menu.protein);
        formData.append("gambar", $scope.menu.gambar); // Attach the image file
        formData.append("bahanBahan", $scope.menu.bahanBahan);
        formData.append("tahapPembuatan", $scope.menu.tahapPembuatan);

        // Send the form data (including the image) to the server
        $http.post("http://localhost:3001/api/menu", formData, {
            headers: { "Content-Type": undefined }, // AngularJS will set the correct content-type automatically
            transformRequest: angular.identity,
        })
            .then(function (response) {
                $scope.message = response.data.message;
                alert("Menu berhasil ditambahkan!");
                $scope.menu = {}; // Clear the form after submission
            })
            .catch(function (error) {
                $scope.message = error.data.message || "Gagal menambahkan menu!";
                console.error("Error:", error);
            });
    };
});

// Recipe App
var recipeApp = angular.module("recipeApp", []);

recipeApp.controller("RecipeController", function ($scope, $http) {
    $scope.recipes = []; // Array to store menu data
    $scope.message = "";

    // Function to get all recipes
    $scope.getRecipes = function () {
        $http.get("http://localhost:3001/api/recipes")
            .then(function (response) {
                $scope.recipes = response.data; // Store the recipes data in the array
            })
            .catch(function (error) {
                $scope.message = error.data.message || "Gagal mengambil data menu!";
                console.error("Error:", error);
            });
    };

    // Function to delete a recipe
    $scope.deleteRecipe = function (id) {
        if (confirm("Anda yakin ingin menghapus menu ini?")) {
            $http.delete(`http://localhost:3001/api/recipes/${id}`)
                .then(function (response) {
                    $scope.message = response.data.message;
                    alert("Menu berhasil dihapus!");
                    $scope.getRecipes(); // Refresh the recipe list
                })
                .catch(function (error) {
                    $scope.message = error.data.message || "Gagal menghapus menu!";
                    console.error("Error:", error);
                });
        }
    };

    // Call getRecipes when controller is loaded
    $scope.getRecipes();
});

var loginApp = angular.module("loginApp", []);

loginApp.controller("LoginController", function ($scope, $http) {
    $scope.user = {};
    $scope.message = "";

    // Login function
    $scope.login = function () {
        $http.post("http://localhost:3001/login", $scope.user)
            .then(function (response) {
                alert(response.data.message);
                if (response.status === 200) {
                    window.location.href = "index.html"; // Redirect to users page
                }
            })
            .catch(function (error) {
                $scope.message = error.data.message || "Login gagal!";
                alert($scope.message);
                console.error("Error:", error);
            });
    };

    // Register function
    $scope.register = function () {
        $http.post("http://localhost:3001/register", $scope.user)
            .then(function (response) {
                alert(response.data.message);
                if (response.status === 201) {
                    window.location.href = "loginpage.html"; // Redirect to login page
                }
            })
            .catch(function (error) {
                $scope.message = error.data.message || "Registrasi gagal!";
                alert($scope.message);
                console.error("Error:", error);
            });
    };
});
