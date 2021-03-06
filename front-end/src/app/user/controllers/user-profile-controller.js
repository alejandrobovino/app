angular.module( 'ngBoilerplate.user.ProfileCtrl', [

])

.controller( 'ProfileCtrl', function ProfileCtrl($rootScope, $scope, $auth, User, growl, $state, resA ) {  

  if (!resA) {
    $state.go('user.login');
  } else {
    $scope.$parent.title = "Profile";

    User.getUser()
      .success(function(data) {
        $scope.user = data;
      })
      .error(function() {
        growl.error("Unable to get information"); 
      });

    $scope.updateUser = function() {
      User.updateUser({
        displayName: $scope.user.displayName,
        email: $scope.user.email
      }).then(function() { 
        growl.success("Profile updated");
      })
      .then(function(){
        User.getUser()
        .success(function(data) {
          $rootScope.username = data.displayName;
        });
      });
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          growl.success('Linked <b>' + provider + '</b> account'); 
          switch(provider) {
            case 'facebook':
              $scope.user.facebook = 1;
            break;
            case 'google':
              $scope.user.google = 1;
            break;
            case 'twitter':
              $scope.user.twitter = 1;
            break;          
          }
          $state.reload();
        })
        .catch(function(response) {
          if (typeof response.data.message != 'undefined') {
            growl.error(response.data.message); 
          }
        });
    };

    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {        
          growl.success('Unlinked <b>' + provider + '</b> account'); 
          switch(provider) {
            case 'facebook':
              $scope.user.facebook = null; 
            break;
            case 'google':
              $scope.user.google = null;
            break;
            case 'twitter':
              $scope.user.twitter = null;
            break;          
          }
        })
        .catch(function(response) {
          growl.error(response.data ?  response.data.message : 'Could not unlink <b>' + provider + '</b> account');
        });
    };

  }
})


;