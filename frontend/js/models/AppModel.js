class AppModel {
	
	constructor(height, width) {
	    this.userType = "";
		this.servicesNeeded = [];
		
		this.username = "";
		this.email = "";
		this.phone = "";
		this.reason = "";
		this.gender = "";
		this.veteran = "";
		this.education = "";
		this.dependents = "";
		this.enthnicity = "";
		this.homesless = "";
		this.employed = "";
		this.dobMonth = "";
		this.dobDay = "";
		this.dobYear = "";
		
		this.uuide = "";
		
		
		
	
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
