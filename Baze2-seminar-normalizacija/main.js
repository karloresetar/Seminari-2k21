var fd_num = 1;
var attributes = new Array();
var fd_lhs = new Array();
var fd_rhs = new Array();
var original_fd_lhs = new Array();
var original_fd_rhs = new Array();
var minimal_cover_num = 0;
var candidate_keys_num = 0;
var normalize_to_3nf_num = 0;
var check_normal_form_num = 0;
var main_find_closure_num = 0;
var candidate_keys = new Array();
var in_2nf, in_3nf, in_bcnf;
var three_nf = new Array();
var minimal_cover_steps = new Array();
var candidate_keys_steps = new Array();
var closure_steps = new Array();
var normal_form_steps = new Array();
var convert_to_3nf_steps = new Array();
var minimal_cover_steps_num;
var candidate_keys_steps_num;

window.addEventListener("load", initialize);

function initialize()
{
	attributes = new Array();
	fd_lhs = new Array();
	fd_rhs = new Array();
	original_fd_lhs = new Array();
	original_fd_rhs = new Array();
	candidate_keys = new Array();
	three_nf = new Array();
	if(minimal_cover_num%2 == 1)
		main_minimal_cover();
	minimal_cover_num = 0;
	if(candidate_keys_num%2 == 1)
		main_candidate_keys();
	candidate_keys_num = 0;
	if(check_normal_form_num%2 == 1)
		main_check_normal_form();
	check_normal_form_num = 0;
	if(normalize_to_3nf_num%2 == 1)
		main_normalize_to_3nf();
	normalize_to_3nf_num = 0;
	if(main_find_closure_num%2 == 1)
		main_find_closure();
	normalize_to_3nf_num = 0;
	document.getElementById('attributes_in').value = "";
	for(var i=1; i<fd_num; i++)
		delete_fd(i);
	fd_num = 1;
	fd_input();
}


const examples = {
	// primjer 1 nije u 3 nf zbog tranzitivne funk ABCD->E->F
	example1: {
		R: "A B C D E F G H I J",
		FO: [{
			lhs: "A B C D",
			rhs: "E F G H I J"
		},{
			lhs: "A B C",
			rhs: "D"
		},{
			lhs: "C D",
			rhs: "G H"
		},{
			lhs: "E",
			rhs: "F"
		},{
			lhs: "G H",
			rhs: "J"
		}] 
	},

	//primjer 2
	example2: {
		R: "A B C D E F G H I J",
		FO: [{
			lhs: "A",
			rhs: "C"
		},{
			lhs: "B",
			rhs: "D"
		},{
			lhs: "A",
			rhs: "E"
		},{
			lhs: "A C",
			rhs: "B"
		},{
			lhs: "D",
			rhs: "A"
		}] 
	},
	//primjer 3
	example3: {
		R: "A B C D E F G H I J",
		FO: [{
			lhs: "A B",
			rhs: "D C"
		},{
			lhs: "D",
			rhs: "A"
		},{
			lhs: "C",
			rhs: "I"
		},{
			lhs: "A C",
			rhs: "H"
		},{
			lhs: "D",
			rhs: "J"
		}] 
	},
	//primjer 4
	example4: {
		R: "A B C D E F G H I J",
		FO: [{
			lhs: "A",
			rhs: "C"
		},{
			lhs: "B",
			rhs: "D"
		},{
			lhs: "A",
			rhs: "E"
		},{
			lhs: "A C",
			rhs: "B"
		},{
			lhs: "D",
			rhs: "A"
		}] 
	},
	//primjer 5
	example5: {
		R: "A B C D E F G H I J",
		FO: [{
			lhs: "A",
			rhs: "C"
		},{
			lhs: "B",
			rhs: "D"
		},{
			lhs: "A",
			rhs: "E"
		},{
			lhs: "A C",
			rhs: "B"
		},{
			lhs: "D",
			rhs: "A"
		}] 
	},
}

function loadExample(exKey) {
	initialize()
	const example = examples[exKey]

	document.getElementById('attributes_in').value = example.R

	example.FO.forEach((fo, i) => {
		document.getElementById(`lhs${i+1}`).value = fo.lhs;
		document.getElementById(`rhs${i+1}`).value = fo.rhs
		if(i < (example.FO.length -1))
		fd_input();
	
	})

}

function lexer() 
{
	attributes = new Array();
	fd_lhs = new Array();
	fd_rhs = new Array();
	var string = document.getElementById('attributes_in').value;
	var i = 0;
	while(i < string.length)
	{
		var j = i;
		var temp = "";
		while(string[j]!=' ' && string[j]!=',' && j<string.length)
		{
			temp += string[j];
			j++;
		}
		attributes.push(temp);
		while(string[j] == ' ' || string[j]==',' && j<string.length)
			j++;
		i = j;
	}

	for(var k=1; k<fd_num; k++)
	{
		if(document.getElementById("lhs"+k) == null)
			continue;
		var arr = new Array();
		i = 0;
		var string = document.getElementById("lhs"+k).value;
		while(i < string.length)
		{
			var j = i;
			var temp = "";
			while(string[j]!=' ' && string[j]!=',' && j<string.length)
			{
				temp += string[j];
				j++;
			}
			arr.push(temp);
			while(string[j] == ' ' || string[j]==',' && j<string.length)
				j++;
			i = j;
		}
		arr.sort();
		fd_lhs.push(arr);
	}

	for(var k=1; k<fd_num; k++)
	{
		if(document.getElementById("lhs"+k) == null)
			continue;
		var arr = new Array();
		i = 0;
		var string = document.getElementById("rhs"+k).value;
		while(i < string.length)
		{
			var j = i;
			var temp = "";
			while(string[j]!=' ' && string[j]!=',' && j<string.length)
			{
				temp += string[j];
				j++;
			}
			arr.push(temp);
			while(string[j] == ' ' || string[j]==',' && j<string.length)
				j++;
			i = j;
		}
		arr.sort();
		fd_rhs.push(arr);
	}

	for(var i=0; i<fd_lhs.length; i++)
		original_fd_lhs[i] = fd_lhs[i].slice();
	for(var i=0; i<fd_rhs.length; i++)
		original_fd_rhs[i] = fd_rhs[i].slice();
}

function fd_input()
{
	var new_fd = "<span id = \"fd"+fd_num+"\">";
	new_fd += "<input type=\"text\" id=\"lhs"+fd_num+"\"><input type=\"text\" id=\"rhs"+fd_num+"\">";
	new_fd += "</span>"
	var container = document.createElement("div");
	container.innerHTML = new_fd;
	document.getElementById('input_form').appendChild(container);
	fd_num++;
}

function delete_fd(num)
{
	document.getElementById("fd"+num).remove();
}


function error()
{
	console.log("Apna Error\n");
}

function find_minimal_cover()
{
	// Punimo nizove attributes[], fd_lhs[] i fd_rhs[] s inicijalnim vrijednostima
	lexer();

	minimal_cover_steps = new Array();

	//Provjera za redundantnim FO i brisanje takvih 
	for(var i = 0; i<fd_rhs.length; i++)
	{
		for(var j=0; j<fd_rhs[i].length; j++)
		{
			//provjera pojedinacnih atributa u fd_rhs[i][j]
			for(var k=0; k<fd_lhs[i].length; k++)
			{
				if(fd_lhs[i][k] == fd_rhs[i][j])
				{
					fd_rhs[i].splice(j, 1);
					j--;
					break;
				}
			}
		}
	}



	//Minimizacija LHS za svaku FO
	//Provjeravamo svaki atribut u fd_lhs; ako je prisutan u fd_rhs i njemu podudarajucem fd_lhs.....

	for(var i=0; i<fd_lhs.length; i++)
	{
		for(var j=0; j<fd_lhs[i].length; j++)
		{
			//Provjera za fd_lhs[i][j]
			for(var k=0; k<fd_rhs.length; k++)
			{
				if(fd_lhs[k].length == fd_lhs[i].length-1)
				{
					var l;
					for(l=0; l<fd_rhs[k].length; l++)
					{
						if(fd_lhs[i][j] == fd_rhs[k][l])
							break;
					}
					if(l != fd_rhs[k].length)
					{
						//Projeravamo pojaavljuju li se atributi fd_lhs[i] u fd_lhs[k]
						var sum = 0;
						for(var m = 0; m<fd_lhs[i].length; m++)
						{
							for(var n=0; n<fd_lhs[k].length; n++)
							{
								if(fd_lhs[i][m] == fd_lhs[k][n])
									sum++;
							}
						}
						if(sum == fd_lhs[i].length-1)
						{
							fd_lhs[i].splice(j, 1);
							j--;
							break;
						}
					}
				}
			}
		}
	}


	//Minimizacija LHS. Ako su za neke atribute u RHS, dva u LHS(l1 i l2), brišemo l1 ako je podkup l2

	for(var i=0; i<fd_rhs.length; i++)
	{
		for(var j=0; j<fd_rhs[i].length; j++)
		{
			//Provjeravamo da li se fd_rhs[i][j] ponavljaju
			var flag = true;
			for(var k=i+1; k<fd_rhs.length && flag; k++)
			{
				for(var l=0; l<fd_rhs[k].length; l++)
				{
					if(fd_rhs[i][j] == fd_rhs[k][l])
					{
						//Ako je lhs[k] podskup lhs[i] brišemo rhs[i][j]  i obratno
						var sum = 0;
						for(var m=0; m<fd_lhs[i].length; m++)
						{
							for(var n = 0; n<fd_lhs[k].length; n++)
							{
								if(fd_lhs[i][m] == fd_lhs[k][n])
									sum++;
							}
						}
						 //console.log("two:  i = "+i+"  j = "+j+"  k = "+k+"  l = "+l+"  sum = "+sum+"\n");
						if(sum == fd_lhs[k].length)
						{
							//brisanje fd_lhs[i][j]
							fd_rhs[i].splice(j, 1);
							flag = false;
							break;
						}
						else if(sum == fd_lhs[i].length)
						{
							//brisanje fd_lhs[k][l]
							fd_rhs[k].splice(l, 1);
							break;
						}
					}
				}
			}
			if(flag == false)
				j--;
		}
	}


	//Za svaki atribut u LHS, provjeravamo je li prisutan u ogradi drugih atributa; ako je brisemo ga
	for(var i=0; i<fd_lhs.length; i++)
	{
		for(var j=0; j<fd_lhs[i].length; j++)
		{
			var temp_arr = fd_lhs[i].slice();
			var att = fd_lhs[i][j];
			temp_arr.splice(j, 1);
			var closure = find_closure(temp_arr, fd_lhs, fd_rhs);
			for(var k=0; k<closure.length; k++)
			{
				if(closure[k] == att)
				{
					fd_lhs[i].splice(j, 1);
					j--;
					break;
				}
			}
		}
	}



	//Brisemo ponavljajuce unose,tj., ako su dvije FO identicne , brisemo jednu
	for(var i=0; i<fd_lhs.length; i++)
	{
		for(var j=i+1; j<fd_lhs.length; j++)
		{
			//ako su pojedini atributi u lhs[i] == lhs[j] i u rhs[i] == rhs[j]
			var flag = true; //brisemo  fd_lhs[j]
		
			
			if(fd_lhs[i].length != fd_lhs[j].length)
				flag = false;
			for(var m = 0; m<fd_lhs[i].length && m<fd_lhs[j].length; m++)
			{
				if(fd_lhs[i][m] != fd_lhs[j][m])
					flag = false;
			}
			if(fd_rhs[i].length != fd_rhs[j].length)
				flag = false;
			for(var m = 0; m<fd_rhs[i].length && m<fd_rhs[j].length; m++)
			{
				if(fd_rhs[i][m] != fd_rhs[j][m])
					flag = false;
			}
			if(flag)
			{
				fd_lhs.splice(j, 1);
				fd_rhs.splice(j, 1);
				j--;
			}
		}
	}

	//Brisanje redundantnih FO (one koje se impliciraju drugima)
	//Provjera da li ograda cijele LHS ostaje ista nakon brisanja FO, ako da; brišemo je

	for(var i=0; i<fd_lhs.length; i++)
	{
		for(var m=0; m<fd_rhs[i].length; m++)
		{
			var temp_fd_lhs = [];
			var temp_fd_rhs = [];
			for(var j=0; j<fd_lhs.length; j++)
				temp_fd_lhs[j] = fd_lhs[j].slice();
			for(var j=0; j<fd_rhs.length; j++)
				temp_fd_rhs[j] = fd_rhs[j].slice();
			temp_fd_rhs[i].splice(m, 1);
			// ako se ograda fd_lhs[i] sastoji od fd_rhs[i],  brisemo fd_lhs[i]
			var closure = find_closure(fd_lhs[i], temp_fd_lhs, temp_fd_rhs);

			var j;
			for(j=0; j<fd_rhs[i].length; j++)
			{
				var k;
				for(k=0; k<closure.length; k++)
				{
					if(closure[k] == fd_rhs[i][j])
						break;
				}
				if(k == closure.length)
					break;
			}
			if(j == fd_rhs[i].length)	
			{
				fd_rhs[i].splice(m, 1);
				m--;
			}
		}
	}

}

function find_closure(lhs, temp_fd_lhs, temp_fd_rhs)
{
	var closure = lhs.slice();
	var new_rhs_coming = true;
	while(new_rhs_coming)
	{
		new_rhs_coming = false;
		for(var i=0; i<temp_fd_lhs.length; i++)
		{
			var lhs_in_closure = true;
			for(var j=0; j<temp_fd_lhs[i].length; j++)
			{
				var lhs_ij_in_closure = false;
				for(var k=0; k<closure.length; k++)
				{
					if(closure[k] == temp_fd_lhs[i][j])
					{
						lhs_ij_in_closure = true;
						break;
					}
				}
				if(lhs_ij_in_closure == false)
				{
					lhs_in_closure = false;
					break;
				}
			}
			if(lhs_in_closure)
			{
				for(var j=0; j<temp_fd_rhs[i].length; j++)
				{
					//ako fd_rhs[i][j]  nije u ogradi, dodajemo ga u ogradu i oznacavamo new_rhs_coming kao 'true'
					var rhs_ij_in_closure = false;
					for(var k=0; k<closure.length; k++)
					{
						if(closure[k] == temp_fd_rhs[i][j])
						{
							rhs_ij_in_closure = true;
							break;
						}
					}
					if(rhs_ij_in_closure == false)
					{
						new_rhs_coming = true;
						closure.push(temp_fd_rhs[i][j]);
					}
				}
			}
		}
	}
	closure.sort();
	return closure;
}

function print_minimal_cover()
{
	var field = "<fieldset>";
	field += "<ul style=\"list-style-type:none\">";
	for(var i=0; i<fd_lhs.length; i++)
	{
		for(var j=0; j<fd_rhs[i].length; j++)
		{
			field += "<li>"
			for(var k=0; k<fd_lhs[i].length; k++)
				field += fd_lhs[i][k]+" ";
			field += "  ->  "+fd_rhs[i][j];
			field += "</li>";
		}
	}
	field += "</label>";
	field += "<div id = \"minimal_cover_steps_field\"></div>";
	field += "</fieldset><br>";
	document.getElementById("minimal_cover_field").innerHTML = field;
}


function main_minimal_cover()
{

	if(minimal_cover_num % 2 == 0)
	{
		find_minimal_cover();
		for(var i=0; i<fd_lhs.length; i++)
		{
			if(verify_input(fd_lhs[i].slice())==false)
				return;
			if(verify_input(fd_rhs[i].slice())==false)
				return;
		}
		minimal_cover_steps_num = 0;
		print_minimal_cover();
	}
	else
	{
		document.getElementById("minimal_cover_field").innerHTML = "";
	}
	minimal_cover_num++;
}


function print_minimal_cover_steps()
{
	if(minimal_cover_steps_num % 2 == 0)
	{
		var string = "";
		for(var i=0; i<minimal_cover_steps.length; i++)
		{
			string += "<span>"+(i+1)+". </span> ";
			string += minimal_cover_steps[i]+"<br><br>";
		}
		document.getElementById("minimal_cover_steps_field").innerHTML = string;
	}
	else
	{
		document.getElementById("minimal_cover_steps_field").innerHTML = "";
	}
	minimal_cover_steps_num++;
}



function find_candidate_keys()
{
	//Reset candidate_keys[]
	candidate_keys = new Array();


	var not_on_rhs = new Array();	//Every candidate key will have these attributes
											//potential_key_store =  R-OnRHSNotOnLHS-ClosureSet(NotOnRHS)
	var potential_key_store = new Array();	//Apart from attributes of not_on_rhs and candidate keys contains attributes from this set
	var closure_not_on_rhs = new Array();	//Closure of not_on_rhs set
	console.log(attributes)
	console.log(fd_rhs)
	console.log(fd_lhs)
	for(var i=0; i<attributes.length; i++)
	{
		var in_rhs = false;
		for(var j=0; j<fd_rhs.length && in_rhs==false; j++)
		{
			for(var k=0; k<fd_rhs[j].length && in_rhs==false; k++) // TRAZI ATRIBUTE KOJI SE NE NALAZE NA DESNOJ STRANI
			{
				
				if(fd_rhs[j][k] == attributes[i])
					in_rhs = true;
			}
		}
		if(in_rhs == false)
			not_on_rhs.push(attributes[i]);
	}



	potential_key_store = attributes.slice();
	console.log("ISPIS potential_key_store: ",potential_key_store.toString())
	// Uklanjamo atribute iz funkcije (gdje spremamo kljuceve) koji su prisutni u funkciji closure(koji nisu na desnoj strani)
	for(var i=0; i<potential_key_store.length; i++)
	{
		var j;
		for(j=0; j<closure_not_on_rhs.length; j++)
		{
			if(closure_not_on_rhs[j] == potential_key_store[i]) // AKO SE NALAZI SAMO NA LIVOJ STRANI ( KOJI NISU NA DESNOJ STRANI)
				break;
		}
		if(j != closure_not_on_rhs.length)
		{
			potential_key_store.splice(i, 1);
			i--;
		}
	}
	// Uklanjamo atribute iz funkcije (gdje spremamo kandidate kljuceva) koji su prisutni u desnoj a nisu na lijevoj strani
	for(var i=0; i<potential_key_store.length; i++)
	{
		var in_lhs = false;
		var in_rhs = false;
		for(var j=0; j<fd_lhs.length && in_lhs==false; j++)
		{
			for(var k=0; k<fd_lhs[j].length && in_lhs==false; k++)
			{
				if(fd_lhs[j][k] == potential_key_store[i])
					in_lhs = true;
			}
		}
		for(var j=0; j<fd_rhs.length && in_rhs==false; j++)
		{
			for(var k=0; k<fd_rhs[j].length && in_rhs==false; k++)
			{
				if(fd_rhs[j][k] == potential_key_store[i])
					in_rhs = true;
			}
		}
		if(in_rhs==true && in_lhs==false)
		{
			potential_key_store.splice(i, 1);
			i--;
		}
	}

	var closure = find_closure(not_on_rhs, fd_lhs, fd_rhs);
	console.log("KLOSHUR: ",closure)
	if(closure.length == attributes.length)		//not_on_rhs is the only candidate key
		candidate_keys.push(not_on_rhs);
	else 		//uzimamo kandidate kljuceva iz funkcije koji nisu na desnoj strani i funkciju potencijalni spremljeni kljucevi
		make_candidate_keys(potential_key_store, not_on_rhs, not_on_rhs);

	//Imamo sve kljuce za kandidate te sortiramo i brisemo prazne (kljuceve kandidate)
	for(var i=0; i<candidate_keys.length; i++)
	{
		if(candidate_keys[i].length == 0)
		{
			candidate_keys.splice(i, 1);
			i--;
			continue;
		}
		candidate_keys[i].sort();
	}
	//Brisemo duplikate kandidiranih kljuceva (candidate_keys[])
	for(var i=0; i<candidate_keys.length; i++)
	{
		for(var j=i+1; j<candidate_keys.length; j++)
		{
			var k=0;
			for(k=0; k<candidate_keys[i].length && k<candidate_keys[j].length; k++)
			{
				if(candidate_keys[i][k] != candidate_keys[j][k])
					break;
			}
			if(candidate_keys[i].length == candidate_keys[j].length && k==candidate_keys[i].length)
			{
				candidate_keys.splice(j, 1);
				j--;
			}
		}
	}
}
// ############### Trazanje candidate key
function make_candidate_keys(potential_key_store, key, not_on_rhs)
{
	for(var i=0; i<potential_key_store.length; i++)
	{
		var temp_key = key.slice();
		temp_key.push(potential_key_store[i]);
		var closure = find_closure(temp_key, fd_lhs, fd_rhs);
		if(closure.length == attributes.length)	//provjera je li kljuc postaje super kljuc
		{
			
			var is_candidate = true;
			//provjera je li kljuc kandidat za kljuc
			for(var j=0; j<temp_key.length; j++)
			{
				var in_notrhs = false;
				for(var k=0; k<not_on_rhs.length && in_notrhs==false; k++)
				{
					if(not_on_rhs[k] == temp_key[j])
						in_notrhs = true;
				}
				if(in_notrhs==false && temp_key[j]!=potential_key_store[i])
				{
					var temp_arr = temp_key.slice();
					temp_arr.splice(j, 1);
					var temp_closure = find_closure(temp_arr, fd_lhs, fd_rhs);
					if(temp_closure.length == attributes.length)
					{
						is_candidate = false;
						break;
					}
				}
			}
			if(is_candidate)
			{
				candidate_keys.push(temp_key);
			}
		}
		else
		{
			var new_key_store = potential_key_store.slice();
			new_key_store.splice(i, 1);
			make_candidate_keys(new_key_store, temp_key, not_on_rhs);
		}
	}
}

function main_candidate_keys()
{
	if(candidate_keys_num % 2 == 0)
	{
		find_minimal_cover();
		for(var i=0; i<fd_lhs.length; i++)
		{
			if(verify_input(fd_lhs[i].slice())==false)
				return;
			if(verify_input(fd_rhs[i].slice())==false)
				return;
		}
		find_candidate_keys();
		candidate_keys_steps_num = 0;
		print_candidate_keys();
	}
	else
	{
		document.getElementById("candidate_keys_field").innerHTML = "";
	}
	candidate_keys_num++;
}

function print_candidate_keys()
{
	var field = "<fieldset>";
	field += "Kljuc:";
	for(var i=0; i<candidate_keys.length; i++)
	{
		field += "<li>"
		for(var j=0; j<candidate_keys[i].length; j++)
			field += candidate_keys[i][j]+" ";
		field += "</li>";
	}

	document.getElementById("candidate_keys_field").innerHTML = field;
}

function print_candidate_keys_steps()
{
	if(candidate_keys_steps_num % 2 == 0)
	{
		var string = "";
		for(var i=0; i<candidate_keys_steps.length; i++)
		{
			string += "<span>"+(i+1)+". </span> ";
			string += candidate_keys_steps[i]+"<br><br>";
		}
		document.getElementById("candidate_keys_steps_field").innerHTML = string;
	}
	else
	{
		document.getElementById("candidate_keys_steps_field").innerHTML = "";
	}
	candidate_keys_steps_num++;
}



function find_normal_form()
{
	in_3nf = in_bcnf = true;
	find_minimal_cover();
	find_candidate_keys();

	//Provjera za 3Nf
	//za svaku funkcijsku ovisnost lijeva strana je superkljuc ili desna strana treba biti osnovni atribut(kljucni atribut)
	for(var i=0; i<original_fd_lhs.length; i++)
	{
		var lhs_is_superkey = false;
		//provjera je li lijeva strana super kljuc #lhs_is_superkey#: 	za svaki potencijalni kljuc provjeravamo je li podskup od (original_fd_lhs[i])
		for(var j=0; j<candidate_keys.length; j++)
		{
			if(candidate_keys[j].length > original_fd_lhs[i].length)
				continue;

			var sum = 0;
			for(var k=0; k<candidate_keys[j].length; k++)
			{
				for(var l=0; l<original_fd_lhs[i].length; l++)
				{
					if(original_fd_lhs[i][l] == candidate_keys[j][k])
					{
						sum++;
						break;
					}
				}
			}
			if(sum == candidate_keys[j].length)
			{
				lhs_is_superkey = true;
				break;
			}
		}
		// ako je lijeva strana super kljuc, onda postoji sansa da je u 3NF
		if(lhs_is_superkey)
			continue;

		//Provjeravamo jesu li svi atributi na desnoj strani(original_fd_rhs[i]) osnovni atributi(kljucni atributi)
		var rhs_are_key = true;
		for(var j=0; j<original_fd_rhs[i].length; j++)
		{
			var k;
			for(k=0; k<candidate_keys.length; k++)
			{
				var l;
				for(l=0; l<candidate_keys[k].length; l++)
				{
					if(candidate_keys[k][l] == original_fd_rhs[i][j])
						break;
				}
				if(l != candidate_keys[k].length)
					break;
			}
			if(k == candidate_keys.length)
			{
				rhs_are_key = false;
				break;
			}
		}
		//Ako lijeva strana nije superkljuc i neki atributi na desnoj strani nisu osnovni atributi onda tablica nije u 3 NF
		if(rhs_are_key == false)
		{
			in_3nf = false;
			break;
		}
	}
	// console.log("in_3nf = "+in_3nf);
	if(in_3nf==false)
	{
		in_bcnf = false;
		return;
	}

	//Provjera za BCNF
	//A table is in BCNF if and only if for every non-trivial FD, the LHS is a superkey. 
	for(var i=0; i<original_fd_lhs.length; i++)
	{
		var lhs_is_superkey = false;
		//Check if lhs_is_superkey: 	for each candidate key, check if it is subset of original_fd_lhs[i]
		for(var j=0; j<candidate_keys.length; j++)
		{
			if(candidate_keys[j].length > original_fd_lhs[i].length)
				continue;

			var sum = 0;
			for(var k=0; k<candidate_keys[j].length; k++)
			{
				for(var l=0; l<original_fd_lhs[i].length; l++)
				{
					if(original_fd_lhs[i][l] == candidate_keys[j][k])
					{
						sum++;
						break;
					}
				}
			}
			if(sum == candidate_keys[j].length)
			{
				lhs_is_superkey = true;
				break;
			}
		}
		if(lhs_is_superkey == false)
		{
			in_bcnf = false;
			break;
		}
	}
	// console.log("in_bcnf = "+in_bcnf);

}

function main_check_normal_form()
{
	if(check_normal_form_num % 2 == 0)
	{
		find_normal_form();
		for(var i=0; i<fd_lhs.length; i++)
		{
			if(verify_input(fd_lhs[i].slice())==false)
				return;
			if(verify_input(fd_rhs[i].slice())==false)
				return;
		}		print_normal_form();
	}
	else
	{
		document.getElementById("check_normal_form_field").innerHTML = "";
	}
	check_normal_form_num++;
}


// ISPIS Normalne forme
function print_normal_form()
{
	var field = "<fieldset>";

	field += "<span class=\"normal_form\">3NF: </span>";
	if(in_3nf)
		field += "Nalazi se u 3 NF";
	else field += "Ne nalazi se u 3 NF";
	field+="<br>";

	field += "<span class=\"normal_form\">BCNF:</span>";
	if(in_bcnf)
		field += "Nalazi se u BCNF";
	else field += "Ne nalazi se u BCNF";


	field += "</fieldset><br>";
	document.getElementById("check_normal_form_field").innerHTML = field;
}


function main_normalize_to_3nf()

{
	if(normalize_to_3nf_num % 2 == 0)
	{
		find_minimal_cover();
		find_normal_form();


		for(var i=0; i<fd_lhs.length; i++)
		{
			if(verify_input(fd_lhs[i].slice())==false)
				return;
			if(verify_input(fd_rhs[i].slice())==false)
				return;
		}
		if(in_3nf)
		{
			var field = "<fieldset>Vec je u 3NF</fieldset>";
			document.getElementById("normalize_to_3nf_field").innerHTML = field;
		}
		else
		{
			var temp_lhs = new Array();
			for(var i=0; i<fd_lhs.length; i++)
			{
				temp_lhs.push(fd_lhs[i].slice());
				temp_lhs[i].sort();
			}
			var temp_rhs = new Array();
			for(var i=0; i<fd_rhs.length; i++)
			{
				temp_rhs.push(fd_rhs[i].slice());
				temp_rhs[i].sort();
			}

			console.log("temp_lhs");
			for(var i=0; i<temp_lhs.length; i++)
			{
				console.log("i = "+i);
				for(var j=0; j<temp_lhs[i].length; j++)
					console.log(temp_lhs[i][j]);
			}
			console.log("temp_rhs");
			for(var i=0; i<temp_rhs.length; i++)
			{
				console.log("i = "+i);
				for(var j=0; j<temp_rhs[i].length; j++)
					console.log(temp_rhs[i][j]);
			}


			//Spajamo dvije funkcijske ovisnosti ako im je lijeva strana(lhs) ista
			for(var i=0; i<temp_lhs.length; i++)
			{
				for(var j=i+1; j<temp_lhs.length; j++)
				{
					if(temp_lhs[i].length != temp_lhs[j].length)
						continue;
					var k=0;
					for(k=0; k<temp_lhs[i].length; k++)
					{
						if(temp_lhs[i][k] != temp_lhs[j][k])
							break;
					}
					if(k == temp_lhs[i].length)
					{
						console.log("i = "+i+"  j = "+j);
						for(var k=0; k<temp_rhs[j].length; k++)
						{
							console.log("ding    "+temp_rhs[j][k]);
							temp_rhs[i].push(temp_rhs[j][k]);
						}
						temp_lhs.splice(j, 1);
						temp_rhs.splice(j, 1);
						j--;
					}
				}
				if(temp_lhs[i].length==0 || temp_rhs[i].length==0)
				{
					temp_lhs.splice(i, 1);
					temp_rhs.splice(i, 1);
				}
			}


			var field = "<fieldset>";
			for(var i=0; i<temp_lhs.length; i++)
			{
				field += "<br><h1>Relacija "+(i+1)+"</h1><br>";
				field += "<span>Atributi : &nbsp;&nbsp;&nbsp;</span>";
				for(var j=0; j<temp_lhs[i].length; j++)
					field += temp_lhs[i][j]+" ";
				for(var j=0; j<temp_rhs[i].length; j++)
					field += temp_rhs[i][j]+" ";
				field += "<br>";
				field += "<span>Kandidat za kljuc :  </span>";
				for(var j=0; j<temp_lhs[i].length; j++)
					field += temp_lhs[i][j]+" ";
				field += "<br><br>";
				
			}
			
			field += "</fieldset><br>";
			document.getElementById("normalize_to_3nf_field").innerHTML = field;
		}
	}
	else
	{
		document.getElementById("normalize_to_3nf_field").innerHTML = "";
	}
	normalize_to_3nf_num++;
}




function verify_input(arr)
{
	for(var i=0;  i<arr.length; i++)
	{
		var j=0;
		for(j=0; j<attributes.length; j++)
		{
			if(attributes[j] == arr[i])
				break;
		}
		if(j == attributes.length)
		{
			alert("Krivi unos : "+arr[i]);
			return false;
		}
	}
	return true;
}


function main_find_closure()
{
	if(main_find_closure_num%2==0)
	{
		find_minimal_cover();
		var field = "<fieldset><div class=\"find_closure\">";
		field += "Unesi atribute : "
		field += "<input type=\"text\" id=\"attributes_to_find_closure\"><br>";
		field += "<button type=\"button\" onclick=\"main_find_closure_two()\">Find Closure</button><br>";
		field += "<div id=\"find_closure_field_two\"></div><br>";
		field += "</div></fieldset><br>";
		document.getElementById("find_closure_field").innerHTML = field;
	}
	else
	{
		document.getElementById("find_closure_field").innerHTML = "";
	}
	main_find_closure_num++;
}

function main_find_closure_two()
{
	var arr = new Array();
	i = 0;
	var string = document.getElementById("attributes_to_find_closure").value;
	while(i < string.length)
	{
		var j = i;
		var temp = "";
		while(string[j]!=' ' && string[j]!=',' && j<string.length)
		{
			temp += string[j];
			j++;
		}
		arr.push(temp);
		while(string[j] == ' ' || string[j]==',' && j<string.length)
			j++;
		i = j;
	}
	arr.sort();
	if(verify_input(arr) == false)
	{
		return;
	}
	var closure = find_closure(arr, fd_lhs, fd_rhs);
	var field = "<span>Closure : </span>";
	for(var i=0; i<closure.length; i++)
		field += closure[i]+" ";
	document.getElementById("find_closure_field_two").innerHTML = field;
}