class HelpDelegate {
	constructor(height, width) {
	    //this.userType = "";
	  }	
	  
	  
	  handleStep1Click(stateSelected)
	  {
		var model = AppModel.getInstance();
		model.userType = stateSelected;
		
		  $("#step1").hide();
		  $("#step2").show();
	  }
	  
	  handleStep2Click()
	  {
  		var model = AppModel.getInstance();
  		model.userType = stateSelected;
		
	  $("#step1").hide();
	  $("#step2").show();
	  }
}

HelpDelegate.getInstance = function()
{
  if(HelpDelegate._instance == null)
  {
	  HelpDelegate._instance = new HelpDelegate();
  }
  return HelpDelegate._instance;
}
HelpDelegate._instance = null;