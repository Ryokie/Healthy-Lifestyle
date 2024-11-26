// Inisialisasi aplikasi AngularJS
var app = angular.module('crudApp', []);

// Controller untuk CRUD
app.controller('CrudController', function ($scope, $http) {
    // Data items (contoh dummy)
    $scope.items = [];

    // Data baru
    $scope.newItem = {};

    // Tambahkan item baru
    $scope.addItem = function () {
        if ($scope.newItem.name && $scope.newItem.age) {
            $http.post('/api/items', $scope.newItem) // Panggil API backend untuk tambah data
                .then(function (response) {
                    $scope.items.push(response.data); // Tambahkan item ke list
                    $scope.newItem = {}; // Reset form
                })
                .catch(function (error) {
                    console.error('Error menambahkan item:', error);
                });
        }
    };

    // Edit item
    $scope.editItem = function (item) {
        const updatedItem = prompt('Edit item:', JSON.stringify(item));
        if (updatedItem) {
            $http.put('/api/items/' + item.id, JSON.parse(updatedItem)) // API update
                .then(function (response) {
                    // Update item di list
                    const index = $scope.items.findIndex((i) => i.id === item.id);
                    $scope.items[index] = response.data;
                })
                .catch(function (error) {
                    console.error('Error mengupdate item:', error);
                });
        }
    };

    // Hapus item
    $scope.deleteItem = function (id) {
        if (confirm('Yakin ingin menghapus item ini?')) {
            $http.delete('/api/items/' + id) // API hapus
                .then(function () {
                    // Hapus item dari list
                    $scope.items = $scope.items.filter((i) => i.id !== id);
                })
                .catch(function (error) {
                    console.error('Error menghapus item:', error);
                });
        }
    };

    // Ambil semua data dari API
    $scope.fetchItems = function () {
        $http.get('/api/items') // API untuk mendapatkan data
            .then(function (response) {
                $scope.items = response.data;
            })
            .catch(function (error) {
                console.error('Error mengambil data:', error);
            });
    };

    // Ambil data awal
    $scope.fetchItems();
});
