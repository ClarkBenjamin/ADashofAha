function Product(bundle){
	//Intial Data
	this.id = (typeof bundle.id !== 'undefined') ? bundle.id : null;
	this.reference_prefix = (typeof bundle.reference_prefix !== 'undefined') ? bundle.reference_prefix : null;
	this.name = (typeof bundle.name !== 'undefined') ? bundle.name : null;
	this.productLine = (typeof bundle.product_line !== 'undefined') ? bundle.product_line : null;
	this.createdAt = (typeof bundle.created_at !== 'undefined') ? bundle.created_at : null;
	
	this.updatedAt = null;
	this.parentId = null;
	this.children = [];
	
	this.addExtendedData = function(mBundle){
		this.updatedAt = (typeof mBundle.updated_at !== 'undefined') ? mBundle.updated_at : null;
		this.parentId = (typeof mBundle.parent !== 'undefined' && typeof mBundle.parent.id !== 'undefined') ? mBundle.parent.id : null;	
		
		var tempArray = [];
		if(this.productLine && typeof mBundle.children !== 'undefined'){
			mBundle.children.forEach(function (child){
				tempArray.push(child.id);	
			});
		}this.children = tempArray;
	}
	
	this.addExtendedData(bundle);
	
	this.toString = function(){
		var ret = 
		"Id: "+this.id+
		" Prefix: "+this.reference_prefix+
		" Name: "+this.name +
		" Product Line: "+((this.productLine) ? "TRUE":"FALSE");
		
		if(this.parentId!=null)ret+=" Parent: "+this.parentId;
		if(this.children.length){
			ret+=" Children: ";
			for(var i=0; i<this.children.length; i++)ret+=this.children[i]+" ";	
		}
		
		return ret;
	}
	
	
	
	
	
	
	
	
}