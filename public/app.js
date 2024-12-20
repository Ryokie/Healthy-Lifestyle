// Login App
var loginApp = angular.module("loginApp", []);

loginApp.controller("LoginController", function ($scope, $http) {
    $scope.user = {};
    $scope.message = "";

    // Login function
    $scope.login = function () {
        $http.post("http://localhost:3001/login/users", $scope.user)
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
        $http.post("http://localhost:3001/register/users1", $scope.user)
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

menuApp.controller("MenuController", function ($scope, $http) {
    $scope.menu = {};
    $scope.message = "";

    // Submit Form to add menu
    $scope.submitForm = function () {
        // Create JSON object to send
        const menuData = {
            namaMakanan: $scope.menu.namaMakanan,
            lamaPembuatan: $scope.menu.lamaPembuatan,
            kkal: $scope.menu.kkal,
            lemak: $scope.menu.lemak,
            karbohidrat: $scope.menu.karbohidrat,
            protein: $scope.menu.protein,
            bahanBahan: $scope.menu.bahanBahan,
            tahapPembuatan: $scope.menu.tahapPembuatan,
            jenisMakanan: $scope.menu.jenisMakanan,
        };

        // Send the menu data as JSON to the server
        $http.post("http://localhost:3001/api/menu", menuData)
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

var recipeApp = angular.module("recipeApp", []);

recipeApp.controller("RecipeController", function ($scope, $http) {
    $scope.recipes = []; // Array to store menu data
    $scope.message = "";
    $scope.isEditing = false; // Pastikan modal tidak muncul pada awalnya
    $scope.selectedRecipe = {};

    // Function to get all recipes
    $scope.getRecipes = function () {
        $http.get("http://localhost:3001/api/recipes")
            .then(function (response) {
                $scope.recipes = response.data;
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

     // Function to select a recipe for editing
     $scope.editRecipe = function (recipe) {
        $scope.isEditing = true;
        $scope.selectedRecipe = angular.copy(recipe); // Buat salinan resep untuk diedit
    };

    $scope.saveRecipe = function () {
        $http.put("http://localhost:3001/api/recipes/" + $scope.selectedRecipe._id, $scope.selectedRecipe)
            .then(function (response) {
                $scope.isEditing = false; // Tutup modal edit
                $scope.getRecipes(); // Refresh daftar resep
            })
            .catch(function (error) {
                console.error("Error saving recipe:", error);
            });
    };

    $scope.cancelEdit = function () {
        $scope.isEditing = false;
    };

    $scope.getRecipes();
});


var loginApp2 = angular.module("loginApp2", []);

loginApp2.controller("LoginController2", function ($scope, $http) {
    $scope.user = {};
    $scope.message = "";

    // Login function
    $scope.login = function () {
        $http.post("http://localhost:3001/login/users1", $scope.user)
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
        $http.post("http://localhost:3001/register/users1", $scope.user)
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

var artikelApp = angular.module('artikelApp', []);

artikelApp.controller('ArtikelController', function($scope, $http) {
    $scope.article = {};  // To store article form data
    $scope.message = "";  // To show success or error messages

    // Function to submit article data to the backend
    $scope.submitArticle = function() {
        const articleData = {
            judul: $scope.article.judul,
            deskripsi: $scope.article.deskripsi,
            konten: $scope.article.konten
        };

        // Sending POST request to create an article
        $http.post('http://localhost:3001/api/artikel', articleData)
            .then(function(response) {
                $scope.message = response.data.message;  // Display success message
                $scope.article = {};  // Clear the form data
                alert("Artikel berhasil ditambahkan!");
            })
            .catch(function(error) {
                $scope.message = error.data.message || "Gagal menambahkan artikel!";
                console.error("Error:", error);
            });
    };
});

var cuttingApp = angular.module("cuttingApp", []);

cuttingApp.controller("CuttingController", function ($scope, $http) {
    $scope.menus = [];  // Array to hold the menu items
    $scope.message = ""; // Message for displaying error or success

    // Function to fetch the cutting menu items
    $scope.getCuttingMenu = function () {
        $http.get("http://localhost:3001/api/recipes/cutting")
            .then(function (response) {
                $scope.menus = response.data;  // Populate menus with the data from the backend
            })
            .catch(function (error) {
                $scope.message = "Gagal mengambil data menu cutting!";
                console.error("Error fetching cutting menus:", error);
            });
    };

    // Call the function to load the menus when the page loads
    $scope.getCuttingMenu();
});

var recipeApp = angular.module("recipeApp", []);

recipeApp.controller("RecipeController", function ($scope, $http) {
    $scope.recipes = [];  // Array untuk menyimpan data menu
    $scope.message = "";
    
    $scope.getBulkingRecipes = function () {
        $http.get("http://localhost:3001/api/recipes/bulking")
            .then(function (response) {
                $scope.recipes = response.data;  // Menyimpan data menu bulking
            })
            .catch(function (error) {
                $scope.message = error.data.message || "Gagal mengambil menu bulking!";
                console.error("Error:", error);
            });
    };

    // Memanggil fungsi untuk mendapatkan menu bulking saat halaman dimuat
    $scope.getBulkingRecipes();
});

