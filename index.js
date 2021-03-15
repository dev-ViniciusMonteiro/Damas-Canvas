var canvas = document.getElementById('damas');
var ctx = canvas.getContext("2d");
var tabuleiro = new tabuleiro("#ffffff", "#008000", "#cccccc", "#000000");//cinza , preto , vermelho e azul
			
function Peca(cor)//caracteristicas da peca cor e se 'e rainha
{
	this.cor = cor;
	this.rainha = false;
}


function casa(cor, Peca){//cor da casa e a peca que esta ali
	this.cor = cor;
	this.Peca = Peca;
}

function tabuleiro(corC1, corC2, corJ1, corJ2){ //cria as pecas e os quadrados do tabuleiro corCasa1, corCasa2 , corJogador1 e corJogador2
	this.corC1 = corC1;
	this.corC2 = corC2;
	this.corJ1 = corJ1;
	this.corJ2 = corJ2;
	this.turno = corJ1;
	this.podeComer = false;//nao pode comer, podera comer se no quando no evento clicar liberar
	this.PecasJ1 = 12;//12 pecas go jogador1
	this.PecasJ2 = 12;//12 pecas do jogador 2
	this.casas = [];

	for(var i=0; i<8; i++){//linha
		this.casas.push([])
        //console.log(this.casas)
		for(var w=0; w<8; w++){//coluna
    		var corcasa = ((i%2==0 && w%2==0) || (i%2==1 && w%2==1)) ? corC1 : corC2;//caso for casa par fica com cor da casa1 se for imper casa 2
			this.casas[i].push(new casa(corcasa, null));//coloca no array de casas as suas cores e sem peca
    			if(i < 3 && corcasa == corC2){ this.casas[i][w].Peca = new Peca(corJ2); }//linha 0,1,2 iniciadas com as pecas de acordo com sua cor(casa certa)
				else if(i > 4 && corcasa == corC2){	this.casas[i][w].Peca = new Peca(corJ1); }//linha 5,6,7 iniciadas com suas pecas de acordo com as cores certas
			}
	}
	this.indicecasaSeleccionada = null;//variavel para atualizar peca
}			


function posicaoMause(canvas, evt){
	var c = canvas.getBoundingClientRect();//retorna um objeto DOMRect fornecendo informações sobre o tamanho de um elemento e sua posição em relação à janela de visualização.
	return { x : evt.clientX-c.left, y : evt.clientY-c.top };//retorna posicao x e y do mause

}

function pegarCasa(canvas, evt){//recebe o canvas e ao evento de click
	var click = posicaoMause(canvas, evt);//chama a funcao que pega a posicao do do ponteiro
	//console.log(click.y , (click.y/100)>>0 , (click.x/100)>>0 )
	return { i : (click.y/100)>>0, w : (click.x/100)>>0 };//retorna a posicao exata em inteiro de acordo com a peca clicada 
}

function moverPeca(origen, destino){//mover peca
	tabuleiro.casas[destino.i][destino.w].Peca = tabuleiro.casas[origen.i][origen.w].Peca;//colo a posicao de saida no destino
	tabuleiro.casas[origen.i][origen.w].Peca = null;//declara a origin como vazia
		if(tabuleiro.casas[destino.i][destino.w].Peca.cor == tabuleiro.corJ1 && destino.i == 0){//se mover para a posicao zero o j1 
			tabuleiro.casas[destino.i][destino.w].Peca.rainha = true;//ele se torna rainha
		}
		else if(tabuleiro.casas[destino.i][destino.w].Peca.cor == tabuleiro.corJ2 && destino.i == 7){//se o mover para o final do tabuleiro j2
			tabuleiro.casas[destino.i][destino.w].Peca.rainha = true;//se torna rainha
		}
}

function casaValida(i, w){//valida a casa anterior da comida
	if(i >= 0 && i <= 7 && w >= 0 && w <= 7){//se for uma posicao valida
		return tabuleiro.casas[i][w].Peca == null;//retorna a posicao anterior como null
	}//se nao
		return false;
	}

function casaValidaComer(i, w){//valida a casa a ser comida
	if(tabuleiro.casas[i][w].Peca.cor == tabuleiro.corJ1 || tabuleiro.casas[i][w].Peca.rainha){//se for a vez do jogador1
		if(casaValida(i-2, w-2)){//pergunta se estava vazia a casa anterior da que esta(antes de ser comida) condicao 1
			if(tabuleiro.casas[i-1][w-1].Peca != null){//se tiveer peca a ser comida
				if(tabuleiro.casas[i-1][w-1].Peca.cor != tabuleiro.casas[i][w].Peca.cor){ return true; }// se for j1 contra j2 retorna true
			}
		}
		if(casaValida(i-2, w+2)){//pergunta se estava vazia a casa anterior da que esta(antes de ser comida) condicao 2
			if(tabuleiro.casas[i-1][w+1].Peca != null){//se tiveer peca a ser comida
				if(tabuleiro.casas[i-1][w+1].Peca.cor != tabuleiro.casas[i][w].Peca.cor){ return true; }// se for j1 contra j2 retorna true
			}
		}
	}
	if(tabuleiro.casas[i][w].Peca.cor == tabuleiro.corJ2 || tabuleiro.casas[i][w].Peca.rainha){//se for a vez do jogador2
		if(casaValida(i+2, w+2)){//pergunta se estava vazia a casa anterior da que esta(antes de ser comida) condicao 1
			if(tabuleiro.casas[i+1][w+1].Peca != null){//se tiveer peca a ser comida
				if(tabuleiro.casas[i+1][w+1].Peca.cor != tabuleiro.casas[i][w].Peca.cor){ return true; }// se for j1 contra j2 retorna true
			}
		}
		if(casaValida(i+2, w-2)){//pergunta se estava vazia a casa anterior da que esta(antes de ser comida) condicao 2
			if(tabuleiro.casas[i+1][w-1].Peca != null){//se tiveer peca a ser comida
				if(tabuleiro.casas[i+1][w-1].Peca.cor != tabuleiro.casas[i][w].Peca.cor){ return true; }// se for j1 contra j2 retorna true
			}
		}
	}
	return false;
}

function validarpodeComer(){//ve se pode comer
	for(var i=0; i<8; i++){
		for(var w=0; w<8; w++){//procura entre sa pecas
			if(tabuleiro.casas[i][w].Peca != null){//se tiver peca com null(foi comida)
				if(tabuleiro.casas[i][w].Peca.cor == tabuleiro.turno){//se for a vez da peca que comeu
					if(casaValidaComer(i, w)){
									return true; 
								}
							}
						}
					}
				}
				return false;
			}


//dois clicks para o movimento do selecionar e o de mover
canvas.addEventListener('click', function(evt){//para cada evento de click ele chamara essa funcao e apos ela sera atualizado o draw(chamado no final)
	var indice = pegarCasa(canvas, evt);//chama a funcao que pega a posicao do ponteiro e salva em indece i=y w=x
	var casa = tabuleiro.casas[indice.i][indice.w];//salva a peca de acordo com a posicao ou deixa null se nao tiver
	if(tabuleiro.indicecasaSeleccionada == null){//se nao tiver uma casa selecionada
		if(casa.Peca != null){//se tiver uma pessa que corresponde a posicao 
			if(casa.Peca.cor == tabuleiro.turno){//se tiver no turno da pessa selecionada
				tabuleiro.respaldocor = casa.cor;//salva a cor em casa
				casa.cor = "#ffff00";//deixa verde o selecionado
				tabuleiro.indicecasaSeleccionada = indice;//coloca o valor de x e y selecionados
			}
		}
	}
	else { // se tiver casa selecionada
		var i = tabuleiro.indicecasaSeleccionada.i;//linha selecionada
		var w = tabuleiro.indicecasaSeleccionada.w; //coluna selecionada
		var realizoMovimiento = false;//coloca que ainda nao realizou o movimento
		if(tabuleiro.casas[i][w].Peca.cor == tabuleiro.corJ2 || tabuleiro.casas[i][w].Peca.rainha){//se for jogada do jogador 2 ou for rainha
			if(tabuleiro.podeComer == false && indice.i == i+1 && indice.w == w+1 && casa.Peca == null){ //se nao poder comer e pode fazer o movimento 
				moverPeca({ i : i, w : w }, indice); //move a peca passando a origem e destino
					realizoMovimiento = true;//coloca movimento como feito
				}
				if(tabuleiro.podeComer == false && indice.i == i+1 && indice.w == w-1 && casa.Peca == null){ //se nao pode comer e movimento e pode fazer o movimento
					moverPeca({ i : i, w : w }, indice); //move a peca passando a origem e destino
					realizoMovimiento = true;//coloca movimento como feito
				}
				if(indice.i == i+2 && indice.w == w+2 && casa.Peca == null){//se pode poder andar 2 e proxima casa livre
					if(tabuleiro.casas[i+1][w+1].Peca.cor != tabuleiro.casas[i][w].Peca.cor){//se as cores forem diferentes(j1 come j2 ou vice versa)
						moverPeca({ i : i, w : w }, indice);//move a peca
						tabuleiro.casas[i+1][w+1].Peca = null;//coloca null na peca comida
						tabuleiro.podeComer = validarpodeComer();//valida se esta na condicao para comer se tiver retorna true
						if(tabuleiro.turno == tabuleiro.corJ1){ tabuleiro.PecasJ2--; }//na vez do j1 diminui a contagem de peca do j2
						else { tabuleiro.PecasJ1--; }//se vez do j2 diminui do j1
						realizoMovimiento = true;//marca movimento como realizado
					}
				}
				if(indice.i == i+2 && indice.w == w-2 && casa.Peca == null){//se pode poder andar 2 e -2 e proxima casa livre
					if(tabuleiro.casas[i+1][w-1].Peca.cor != tabuleiro.casas[i][w].Peca.cor){//se as cores forem diferentes(j1 come j2 ou vice versa)
						moverPeca({ i : i, w : w }, indice);//move peca
						tabuleiro.casas[i+1][w-1].Peca = null;//coloca null na peca comida
						tabuleiro.podeComer = validarpodeComer();//valida se esta na condicao para comer se tiver retorna true
						if(tabuleiro.turno == tabuleiro.corJ1){ tabuleiro.PecasJ2--; }//na vez do j1 diminui a contagem de peca do j2
						else { tabuleiro.PecasJ1--; }//se vez do j2 diminui do j1
						realizoMovimiento = true;//marca movimento como realizado
					}
				}
			}
			if(tabuleiro.casas[i][w].Peca != null){//faz a mesma coisa de cima so mudando o + pelo - pois muda a direcao que anda o j1
				if(tabuleiro.casas[i][w].Peca.cor == tabuleiro.corJ1 || tabuleiro.casas[i][w].Peca.rainha){
					if(tabuleiro.podeComer == false && indice.i == i-1 && indice.w == w-1 && casa.Peca == null){ 
						moverPeca({ i : i, w : w }, indice); 
						realizoMovimiento = true;
					}
					if(tabuleiro.podeComer == false && indice.i == i-1 && indice.w == w+1 && casa.Peca == null){ 
						moverPeca({ i : i, w : w }, indice); 
						realizoMovimiento = true;
					}
					if(indice.i == i-2 && indice.w == w-2 && casa.Peca == null){
						if(tabuleiro.casas[i-1][w-1].Peca.cor != tabuleiro.casas[i][w].Peca.cor){
							moverPeca({ i : i, w : w }, indice);
							tabuleiro.casas[i-1][w-1].Peca = null;
							tabuleiro.podeComer = validarpodeComer();
							if(tabuleiro.turno == tabuleiro.corJ1){ tabuleiro.PecasJ2--; }
							else { tabuleiro.PecasJ1--; }
							realizoMovimiento = true;
						}
					}
					if(indice.i == i-2 && indice.w == w+2 && casa.Peca == null){
						if(tabuleiro.casas[i-1][w+1].Peca.cor != tabuleiro.casas[i][w].Peca.cor){
							moverPeca({ i : i, w : w }, indice);
							tabuleiro.casas[i-1][w+1].Peca = null;
							tabuleiro.podeComer = validarpodeComer();
							if(tabuleiro.turno == tabuleiro.corJ1){ tabuleiro.PecasJ2--; }
							else { tabuleiro.PecasJ1--; }
							realizoMovimiento = true;
						}
					}
				}
			}
			tabuleiro.casas[i][w].cor = ((i%2==0 && w%2==0) || (i%2==1 && w%2==1)) ? tabuleiro.corC1 : tabuleiro.corC2;//limpa o verde para nao ficar rastro 
			tabuleiro.indicecasaSeleccionada = null;//deixa sem nada selecionado apos jogada
				if(realizoMovimiento){//pos movimento
					if(tabuleiro.PecasJ1 == 0){ alert("jogador 2 ganhou"); }//se nao sobrou peca
					if(tabuleiro.PecasJ2 == 0){ alert("jogador 1 ganhou"); }
					if(tabuleiro.podeComer == false){//se nao pode comer
						tabuleiro.turno = tabuleiro.turno == tabuleiro.corJ1 ? tabuleiro.corJ2 : tabuleiro.corJ1;//muda a vez de quem joga
						tabuleiro.podeComer = validarpodeComer();//obriga a comer se for a vez dele e poder comer
					}
				}
	}
	draw();
}, false);

function draw() { // chamado no body (inicia o programa)
    // console.log('teste')
    //ctx.rect(0, 0, damas.width, damas.height);
    for(var i=0; i<8; i++){//para cada lonha do tabuleiro
    	for(var w=0; w<8; w++){//cada casa do tabuleiro  8x8
    		ctx.fillStyle = tabuleiro.casas[i][w].cor; //para cada posicao do tabuleiro de acordo com a cor
    		ctx.fillRect(w*100, i*100, 100, 100);//cria um quadrado na posicao com a cor acima (tabuleiro)
    		if(tabuleiro.casas[i][w].Peca != null){//se a casa do tabuleiro tiver peca
				ctx.beginPath();
    			ctx.fillStyle = tabuleiro.casas[i][w].Peca.cor;//salva a cor do circulo do jogador 1 ou 2
    			ctx.arc(w*100+50, i*100+50, 40, 0, 2*Math.PI, false);//desenha o circulo
				ctx.fill();//preenche a cor dentro
				ctx.closePath();
				if(tabuleiro.casas[i][w].Peca.rainha){//se for rainha
						ctx.fillStyle = "#FFDD33";//coloca cor de rainha
    					ctx.fillRect(w*100+40, i*100+40, 20, 20);//pinta dentro
				}
		    }
		}
	}
}