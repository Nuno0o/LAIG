%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%% BOT MANAGEMENT %%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


:- use_module(library(random)).

%%%%%%%%%%%%%%% RANDOM BOT %%%%%%%%%%%%%%%%%%%%%%%%

% Get a random number from 0 - 11
getRandomCoords(X) :- random(0, 12, X).
	
% Get a random play
getPlayBotRandom(Player, Play, (IvoryStack, CigarStack, Board),(IvoryStackOut, CigarStackOut, BoardOut), GameOver) :-
				getRandomCoords(X), getRandomCoords(Y),
				getRandomCoords(TargetX), getRandomCoords(TargetY),
				Play = (Player, X, Y, TargetX, TargetY),
				BoardOut ^ (makePlay(Play,(IvoryStack,CigarStack,Board), (IvoryStackOut, CigarStackOut, BoardOut), GameOver)).

% Get a valid random play
insistOnCorrectBotRandomPlay(Player, Play, (IvoryStackIn, CigarStackIn, BoardIn),(IvoryStackOut, CigarStackOut, BoardOut), GameOver):- repeat,
					  getPlayBotRandom(Player, Play, (IvoryStackIn, CigarStackIn, BoardIn),(IvoryStackOut, CigarStackOut, BoardOut), GameOver).

% Output play to console
writeBotPlay((Player, X, Y, TargetX, TargetY)) :- 	write(Player), write(' bot moving piece at ('),
													matchInput(X, CX), write(CX), write(', '), 
													matchInput(Y, CY), write(CY), write(') to ('),
													matchInput(TargetX, CTargetX), write(CTargetX), write(', '), 
													matchInput(TargetY, CTargetY), write(CTargetY), write(')').

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% BEST PLAY BOT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


%%%%%%%%%%%%%% IVORY %%%%%%%%%%%%%%%%%%%%%%%%%

% Get a smart play
getBestPlay(ivory, BoardIn, IvoryStackIn, CigarStackIn, (X,Y,TargetX,TargetY,Score)) :-
			getBest_IterateY(0, ivory, BoardIn, IvoryStackIn, CigarStackIn, (X,Y,TargetX,TargetY,Score)).

% Smart play auxiliar on rows
getBest_IterateY(ThisY, ivory, _, _, _, (_,_,_,_,Score)) :- ThisY == 12, Score = -1.
getBest_IterateY(ThisY, ivory, BoardIn, IvoryStackIn, CigarStackIn,(X,Y,TargetX,TargetY,Score)) :-
				ThisY < 12,
				getBest_IterateX(0, ThisY, ivory, BoardIn, IvoryStackIn, CigarStackIn, (NewX, NewY, NewTargetX, NewTargetY, NewScore)),
				AnotherY is ThisY + 1,
				getBest_IterateY(AnotherY, ivory, BoardIn, IvoryStackIn, CigarStackIn, (OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)),
				judgeScores((X,Y,TargetX,TargetY,Score),(NewX,NewY,NewTargetX,NewTargetY,NewScore),(OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)).

% Smart play auxiliar on columns
getBest_IterateX(ThisX, _, ivory, _, _, _, (_,_,_,_,Score)) :- ThisX == 12, Score = -1.
getBest_IterateX(ThisX, ThisY, ivory, BoardIn, IvoryStackIn, CigarStackIn, (X,Y,TargetX,TargetY,Score)) :-
				ThisX \= 12,
				((isIvory(ThisX, ThisY, BoardIn) ->
					getBestTarget(ivory, ThisX, ThisY, BoardIn, IvoryStackIn, CigarStackIn, (NewX, NewY, NewTargetX, NewTargetY, NewScore))); grabValues((NewX, NewY, NewTargetX, NewTargetY, NewScore))),			
				AnotherX is ThisX + 1,
				getBest_IterateX(AnotherX, ThisY, ivory, BoardIn, IvoryStackIn, CigarStackIn, (OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)),
				judgeScores((X,Y,TargetX,TargetY,Score),(NewX,NewY,NewTargetX,NewTargetY,NewScore),(OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)).

%%%%%%%%%%%%%%%%% CIGAR %%%%%%%%%%%%%%%%%%%%%%%%%%

% Get a smart play
getBestPlay(cigar, BoardIn, IvoryStackIn, CigarStackIn, (X,Y,TargetX,TargetY,Score)) :-
			getBest_IterateY(0, cigar, BoardIn, IvoryStackIn, CigarStackIn, (X,Y,TargetX,TargetY,Score)).

% Smart play auxiliar on rows
getBest_IterateY(ThisY, cigar, _, _, _, (_,_,_,_,Score)) :- ThisY == 12, Score = -1.
getBest_IterateY(ThisY, cigar, BoardIn, IvoryStackIn, CigarStackIn,(X,Y,TargetX,TargetY,Score)) :-
				ThisY < 12,
				getBest_IterateX(0, ThisY, cigar, BoardIn, IvoryStackIn, CigarStackIn, (NewX, NewY, NewTargetX, NewTargetY, NewScore)),
				AnotherY is ThisY + 1,
				getBest_IterateY(AnotherY, cigar, BoardIn, IvoryStackIn, CigarStackIn, (OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)),
				judgeScores((X,Y,TargetX,TargetY,Score),(NewX,NewY,NewTargetX,NewTargetY,NewScore),(OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)).

% Smart play auxiliar on columns
getBest_IterateX(ThisX, _, cigar, _, _, _, (_,_,_,_,Score)) :- ThisX == 12, Score = -1.
getBest_IterateX(ThisX, ThisY, cigar, BoardIn, IvoryStackIn, CigarStackIn, (X,Y,TargetX,TargetY,Score)) :-
				ThisX \= 12,
				((isCigar(ThisX, ThisY, BoardIn) ->
					getBestTarget(cigar, ThisX, ThisY, BoardIn, IvoryStackIn, CigarStackIn, (NewX, NewY, NewTargetX, NewTargetY, NewScore))); grabValues((NewX, NewY, NewTargetX, NewTargetY, NewScore))),			
				AnotherX is ThisX + 1,
				getBest_IterateX(AnotherX, ThisY, cigar, BoardIn, IvoryStackIn, CigarStackIn, (OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)),
				judgeScores((X,Y,TargetX,TargetY,Score),(NewX,NewY,NewTargetX,NewTargetY,NewScore),(OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)).

%%%%%%%%%%%%%%%%%%%%% BEST PLAY CALCULATION %%%%%%%%%%%%%%%%%%%%%%%

% Calculate the best target for current position
getBestTarget(Player, ThisX, ThisY, BoardIn, IvoryStackIn, CigarStackIn, (X, Y, TargetX, TargetY, Score)) :-
			getBestTarget_IterateY(0, Player, ThisX, ThisY, BoardIn, IvoryStackIn, CigarStackIn, (X, Y, TargetX, TargetY, Score)).

% Calculate target auxiliar - rows
getBestTarget_IterateY(IterY, _, _, _, _, _, _, (_,_,_,_, Score)) :- IterY == 12, Score = -1.
getBestTarget_IterateY(IterY, Player, ThisX, ThisY, BoardIn, IvoryStackIn, CigarStackIn, (X, Y, TargetX, TargetY, Score)) :- 
						IterY \= 12,
						getBestTarget_IterateX(0, IterY, Player, ThisX, ThisY, BoardIn, IvoryStackIn, CigarStackIn, (NewX, NewY, NewTargetX, NewTargetY, NewScore)),
						AnotherY is IterY + 1,
						getBestTarget_IterateY(AnotherY, Player, ThisX, ThisY, BoardIn, IvoryStackIn, CigarStackIn, (OtherX, OtherY, OtherTargetX, OtherTargetY, OtherScore)),
						judgeScores((X,Y,TargetX,TargetY,Score),(NewX,NewY,NewTargetX,NewTargetY,NewScore),(OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)).

% Calculate target auxiliar - columns
getBestTarget_IterateX(IterX, _, _, _, _, _, _, _, (_,_,_,_, Score)) :- IterX == 12, Score = -1.
getBestTarget_IterateX(IterX, IterY, Player, ThisX, ThisY, BoardIn, IvoryStackIn, CigarStackIn, (X, Y, TargetX, TargetY, Score)) :-
						IterX \= 12,
						((makePlay((Player,ThisX,ThisY,IterX,IterY),(IvoryStackIn,CigarStackIn,BoardIn),(IvoryStackOut, CigarStackOut, _), GameOver) ->
							(( GameOver == true -> NewScore = 500);
								checkStackReduced(Player, IvoryStackIn, CigarStackIn, IvoryStackOut, CigarStackOut, NewScore)));
							NewScore = 0),
						AnotherX is IterX + 1,
						getBestTarget_IterateX(AnotherX, IterY, Player, ThisX, ThisY, BoardIn, IvoryStackIn, CigarStackIn, (OtherX, OtherY, OtherTargetX, OtherTargetY, OtherScore)),
						judgeScores((X,Y,TargetX,TargetY,Score),(ThisX,ThisY,IterX,IterY,NewScore),(OtherX,OtherY,OtherTargetX,OtherTargetY,OtherScore)).

% Moved to free spot, removed 1 from a stack
checkStackReduced(ivory, IvoryStackIn, _, IvoryStackOut, _, Score) :- 
					random(-5, 5, Delta),
					(( (IvoryStackOut < IvoryStackIn) -> 
						Score is (50 + Delta));
						Score = (100 + Delta)).
% Moved to free spot, removed 1 from a stack
checkStackReduced(cigar, _, CigarStackIn, _, CigarStackOut, Score) :- 
					random(-5, 5, Delta),
					(( (CigarStackOut < CigarStackIn) -> 
						Score is (50 + Delta));
						Score = (100 + Delta)).

% Reset score
grabValues((_,_,_,_,Score)) :- Score is -1.

% Judge score to be given based on play
judgeScores((ResultingX, ResultingY, ResultingTargetX, ResultingTargetY,ResultingScore),(X1, Y1, TargetX1, TargetY1,Score1),(_, _, _, _, Score2)) :-
			Score1 >= Score2,
			ResultingScore = Score1,
			ResultingX = X1,
			ResultingY = Y1,
			ResultingTargetX = TargetX1,
			ResultingTargetY = TargetY1.
% Judge score to be given based on play
judgeScores((ResultingX, ResultingY, ResultingTargetX, ResultingTargetY,ResultingScore),(_, _, _, _,Score1),(X2, Y2, TargetX2, TargetY2, Score2)) :-
			Score1 < Score2,
			ResultingScore = Score2,
			ResultingX = X2,
			ResultingY = Y2,
			ResultingTargetX = TargetX2,
			ResultingTargetY = TargetY2.

% Execute smart play
playBestBot(Player, Play, (IvoryStackIn, CigarStackIn, BoardIn),(IvoryStackOut, CigarStackOut, BoardOut), GameOver) :-
				getBestPlay(Player, BoardIn, IvoryStackIn, CigarStackIn, (X,Y,TargetX,TargetY,_)),
				Play = (Player, X, Y, TargetX, TargetY),
				BoardOut ^ (makePlay(Play,(IvoryStackIn,CigarStackIn,BoardIn), (IvoryStackOut, CigarStackOut, BoardOut), GameOver)).