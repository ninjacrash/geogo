class AppModel {
	
	constructor(height, width) {
	    this.userType = "";
		this.servicesNeeded = [];
	  }
}

AppModel.getInstance = function()
 {
  if(AppModel._instance == null)
  {
	  AppModel._instance = new AppModel();
  }
  return AppModel._instance;
 }
AppModel._instance = null;
AppModel.MAN 		= "man";
AppModel.WOMAN 		= "woman";
AppModel.FAMILY 	= "family";
AppModel.ANONYMOUS	= "anonymous";
