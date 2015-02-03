/**
 * New node file
 */
var ejs = require("ejs");
var mysql = require('./mysql');

function signin(req,res) {
	ejs.renderFile('./views/signin.ejs',{error : ""},function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}

function homepage(req,res){
	if (!req.session.isLoggedin){
		req.session.isLoggedin=true;
		var getUser="select user_id, firstname, lastname, isadmin from user_info where username='"+req.param("inputUsername")+"' AND password = '"+req.param("inputPassword")+"' and isactive = 'Y'";
		console.log("Query is:"+getUser);

		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else
			{
				if(results.length === 1){
					req.session.userId=results[0].user_id;
					req.session.fullName=results[0].firstname + " " + results[0].lastname;
					req.session.isAdmin=results[0].isadmin;

					console.log("valid Login"+JSON.stringify(results));
					console.log("First Name is: "+results[0].firstname);
					console.log("Last Name is: "+results[0].lastname);
					console.log("full name is:"+req.session.fullName);
					var fetchStandingQuery =	"select username, firstname, lastname, user_info.user_id, sum(RESULT_POINTS) sum_result_points, sum(TOSS_POINTS) sum_toss_points, "+
					"sum(MOM_POINTS) sum_mom_points, sum(RESULT_BASEDON_ORDER_POINTS) sum_result_basedon_order_points, "+
					"sum(VICTORY_MARGIN_POINTS) sum_victory_margin_points, sum(RUNS_IN_OVER_POINTS) sum_runs_in_over_points, SUM(TOTAL_POINTS_IN_MATCH) sum_total_points_in_match "+
					"from USER_MATCH_POINT_DETAILS , user_info where USER_MATCH_POINT_DETAILS.user_id = user_info.user_id group by user_info.user_id order by sum_total_points_in_match desc"

					mysql.fetchData(function(err,resultsStandingDetails){
						if(err){
							throw err;
						}
						else{
							ejs.renderFile('./views/home.ejs',{error : "", userFullName: req.session.fullName, isAdmin: req.session.isAdmin, standingDetails: resultsStandingDetails},function(err, result) {
								// render on success
								if (!err) {
									res.end(result);
								}
								// render or error
								else {
									res.end('An error occurred');
									console.log(err);
								}
							});
						}
					},fetchStandingQuery);

				}
				else {
					console.log("Invalid Login");
					ejs.renderFile('./views/signin.ejs',{error : "*Invalid Password"},function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
				}
			}
		},getUser);	
	} else {
		var fetchStandingQuery =	"select username, firstname, lastname, user_info.user_id, sum(RESULT_POINTS) sum_result_points, sum(TOSS_POINTS) sum_toss_points, "+
		"sum(MOM_POINTS) sum_mom_points, sum(RESULT_BASEDON_ORDER_POINTS) sum_result_basedon_order_points, "+
		"sum(VICTORY_MARGIN_POINTS) sum_victory_margin_points, sum(RUNS_IN_OVER_POINTS) sum_runs_in_over_points, SUM(TOTAL_POINTS_IN_MATCH) sum_total_points_in_match "+
		"from USER_MATCH_POINT_DETAILS , user_info where USER_MATCH_POINT_DETAILS.user_id = user_info.user_id group by user_info.user_id order by sum_total_points_in_match desc"

		mysql.fetchData(function(err,resultsStandingDetails){
			if(err){
				throw err;
			}
			else{
				ejs.renderFile('./views/home.ejs',{error : "", userFullName: req.session.fullName, isAdmin: req.session.isAdmin, standingDetails: resultsStandingDetails},function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
		},fetchStandingQuery);		
	}

}

function myBetting(req,res) {
	if(typeof(req.session.fullName) === "undefined"){
		console.log("Authentication unsuccessfull");
		res.redirect('/signin');
	}else{
		var fetchUserPointDetails = "select TOTAL_POINTS_PURCHASED, TOTAL_POINTS_AVAILABLE, (TOTAL_POINTS_AVAILABLE/TOTAL_POINTS_PURCHASED)*100 percent from user_info where user_id = "+req.session.userId;

		mysql.fetchData(function(err,resultUserPointDetails){
			if(err){
				throw err;
			}
			else{
				var fetchUserBettingDetails = "select match_id, match_name, match_result, toss_result, mom_result , result_basedon_order, victory_margin , runs_in_over ,"+
				"(select RESULT_TEAM_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_team_bet,"+
				"(select RESULT_TEAM_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_team_bet_points," +
				"(select TOSS_TEAM_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_toss_bet," +
				"(select TOSS_TEAM_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_toss_bet_points," +
				"(select MOM_PERSON_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_mom_bet," +
				"(select MOM_PERSON_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_mom_bet_points," +
				"(select RESULT_ORDER_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_result_order_bet," +
				"(select RESULT_ORDER_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_result_order_bet_points," +
				"(select VICTORY_MARGIN_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_victory_margin_bet," +
				"(select VICTORY_MARGIN_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_victory_margin_bet_points," +
				"(select RUNS_IN_OVER_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_runs_in_over_bet," +
				"(select RUNS_IN_OVER_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_runs_in_over_bet_points, " +
				"(select RESULT_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_results_points_won, " +
				"(select TOSS_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_toss_points_won, " +
				"(select MOM_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_mom_points_won, " +
				"(select RESULT_BASEDON_ORDER_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_order_points_won, " +
				"(select VICTORY_MARGIN_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_victory_margin_points_won, " +
				"(select RUNS_IN_OVER_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_runs_in_over_points_won, " +
				"(select TOTAL_POINTS_IN_MATCH from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+req.session.userId+") user_total_points_won_in_match" +
				" from match_details b;";

				mysql.fetchData(function(err,resultUserBettingDetails){
					if(err){
						throw err;
					}
					else{
						ejs.renderFile('./views/myBetting.ejs',{userPointDetails: resultUserPointDetails, userBettingDetails: resultUserBettingDetails, error : "", userFullName: req.session.fullName},function(err, result) {
							// render on success
							if (!err) {
								res.end(result);
							}
							// render or error
							else {
								res.end('An error occurred');
								console.log(err);
							}
						});
					}
				},fetchUserBettingDetails);

			}
		},fetchUserPointDetails);		
	}
}

function displayBets(req,res) {
	if(typeof(req.session.fullName) === "undefined"){
		console.log("Authentication unsuccessfull");
		res.redirect('/signin');
	}else{
		var user_id = req.params.id;
		console.log("Displaying records for user id:"+user_id);
		var fetchUserPointDetails = "select concat(concat(firstname, ' '), lastname) fullName, TOTAL_POINTS_PURCHASED, TOTAL_POINTS_AVAILABLE, (TOTAL_POINTS_AVAILABLE/TOTAL_POINTS_PURCHASED)*100 percent from user_info where user_id = "+user_id;

		mysql.fetchData(function(err,resultUserPointDetails){
			if(err){
				throw err;
			}
			else{
				var fetchUserBettingDetails = "select match_id, match_name, match_result, toss_result, mom_result , result_basedon_order, victory_margin , runs_in_over ,"+
				"(select RESULT_TEAM_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_team_bet,"+
				"(select RESULT_TEAM_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_team_bet_points," +
				"(select TOSS_TEAM_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_toss_bet," +
				"(select TOSS_TEAM_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_toss_bet_points," +
				"(select MOM_PERSON_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_mom_bet," +
				"(select MOM_PERSON_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_mom_bet_points," +
				"(select RESULT_ORDER_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_result_order_bet," +
				"(select RESULT_ORDER_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_result_order_bet_points," +
				"(select VICTORY_MARGIN_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_victory_margin_bet," +
				"(select VICTORY_MARGIN_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_victory_margin_bet_points," +
				"(select RUNS_IN_OVER_BET from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_runs_in_over_bet," +
				"(select RUNS_IN_OVER_BET_POINTS from match_betting_details a where a.match_id = b.match_id and user_id = "+user_id+") user_runs_in_over_bet_points, " +
				"(select RESULT_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+user_id+") user_results_points_won, " +
				"(select TOSS_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+user_id+") user_toss_points_won, " +
				"(select MOM_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+user_id+") user_mom_points_won, " +
				"(select RESULT_BASEDON_ORDER_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+user_id+") user_order_points_won, " +
				"(select VICTORY_MARGIN_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+user_id+") user_victory_margin_points_won, " +
				"(select RUNS_IN_OVER_POINTS from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+user_id+") user_runs_in_over_points_won, " +
				"(select TOTAL_POINTS_IN_MATCH from USER_MATCH_POINT_DETAILS a where a.match_id = b.match_id and user_id = "+user_id+") user_total_points_won_in_match" +
				" from match_details b where BETTING_CUTOFF_TIME < sysdate()";

				mysql.fetchData(function(err,resultUserBettingDetails){
					if(err){
						throw err;
					}
					else{
						ejs.renderFile('./views/displaybets.ejs',{userPointDetails: resultUserPointDetails, userBettingDetails: resultUserBettingDetails, error : "", userFullName: req.session.fullName},function(err, result) {
							// render on success
							if (!err) {
								res.end(result);
							}
							// render or error
							else {
								res.end('An error occurred');
								console.log(err);
							}
						});
					}
				},fetchUserBettingDetails);

			}
		},fetchUserPointDetails);		
	}
}

function enterBet(req,res) {
	if(typeof(req.session.fullName) === "undefined"){
		console.log("Authentication unsuccessfull");
		res.redirect('/signin');
	}else{
		var match_id = req.param("matchid");
		console.log("match_id is:"+match_id);
		var fetchMatchDetails = "select match_id, match_name, BETTING_CUTOFF_TIME, MATCH_STATUS, sysdate() curdate from match_details where match_id = "+match_id;

		mysql.fetchData(function(err,resultMatchDetails){
			if(err){
				throw err;
			}
			else{
				console.log("resultMatchDetails[0].BETTING_CUTOFF_TIME"+resultMatchDetails[0].BETTING_CUTOFF_TIME);
				console.log("resultMatchDetails[0].curdate"+resultMatchDetails[0].curdate);

				if (resultMatchDetails[0].BETTING_CUTOFF_TIME < resultMatchDetails[0].curdate){
					console.log("Betting time has expired.");
					var fetchMatchUserBettingDetails = "select RESULT_TEAM_BET, RESULT_TEAM_BET_POINTS, TOSS_TEAM_BET, TOSS_TEAM_BET_POINTS, MOM_PERSON_BET, MOM_PERSON_BET_POINTS, RESULT_ORDER_BET, RESULT_ORDER_BET_POINTS, VICTORY_MARGIN_BET, "+
					"VICTORY_MARGIN_BET_POINTS, RUNS_IN_OVER_BET, RUNS_IN_OVER_BET_POINTS FROM MATCH_BETTING_DETAILS where "+
					"user_id = "+req.session.userId+" and match_id = "+match_id;
					mysql.fetchData(function(err,resultMatchUserBettingDetails){
						if(err){
							throw err;
						}
						else{
							console.log("inside readonly bets");
							ejs.renderFile('./views/readonlybet.ejs',{matchDetails : resultMatchDetails, userMatchBettingDetails:resultMatchUserBettingDetails, hasBetsBeenPlaced: resultMatchUserBettingDetails.length, userFullName: req.session.fullName},function(err, result) {
								// render on success
								if (!err) {
									res.end(result);
								}
								// render or error
								else {
									res.end('An error occurred');
									console.log(err);
								}
							});

						}
					},fetchMatchUserBettingDetails);


				} else{
					var fetchMatchUserBettingDetails = "select RESULT_TEAM_BET, RESULT_TEAM_BET_POINTS, TOSS_TEAM_BET, TOSS_TEAM_BET_POINTS, MOM_PERSON_BET, MOM_PERSON_BET_POINTS, RESULT_ORDER_BET, RESULT_ORDER_BET_POINTS, VICTORY_MARGIN_BET, "+
					"VICTORY_MARGIN_BET_POINTS, RUNS_IN_OVER_BET, RUNS_IN_OVER_BET_POINTS FROM MATCH_BETTING_DETAILS where "+
					"user_id = "+req.session.userId+" and match_id = "+match_id;
					mysql.fetchData(function(err,resultMatchUserBettingDetails){
						if(err){
							throw err;
						}
						else{
							if(resultMatchUserBettingDetails.length === 0){
								ejs.renderFile('./views/enterbet.ejs',{matchDetails : resultMatchDetails, userFullName: req.session.fullName},function(err, result) {
									// render on success
									if (!err) {
										res.end(result);
									}
									// render or error
									else {
										res.end('An error occurred');
										console.log(err);
									}
								});
							}else{
								ejs.renderFile('./views/editbet.ejs',{matchDetails : resultMatchDetails, userMatchBettingDetails:resultMatchUserBettingDetails, userFullName: req.session.fullName},function(err, result) {
									// render on success
									if (!err) {
										res.end(result);
									}
									// render or error
									else {
										res.end('An error occurred');
										console.log(err);
									}
								});							
							}
						}
					},fetchMatchUserBettingDetails);
					console.log("Bettings can still be changed.");
				}


			}
		},fetchMatchDetails);		
	}

}

function placeBet(req,res) {
	if(typeof(req.session.fullName) === "undefined"){
		console.log("Authentication unsuccessfull");
		res.redirect('/signin');
	}else{
		var match_id = req.param("matchid");
		var winningTeam = req.param("winningTeam");
		var winningTeamBetPoints = req.param("winningTeamBetPoints");
		var mom = req.param("mom");
		var momBetPoints = req.param("momBetPoints");
		var teamWinningToss = req.param("teamWinningToss");
		var teamWinningTossBetPoints = req.param("teamWinningTossBetPoints");
		var battingOrderBet = req.param("battingOrderBet");
		var battingOrderBetPoints = req.param("battingOrderBetPoints");
		var runsScoredInOver = req.param("runsScoredInOver");
		var runsScoredInOverBetPoints = req.param("runsScoredInOverBetPoints");
		var victoryMargin = req.param("victoryMargin");
		var victoryMarginBetPoints = req.param("victoryMarginBetPoints");
		var action=req.param("action");

		console.log("action is:"+action);
		console.log("match_id is:"+match_id);
		console.log("winningTeam is:"+winningTeam);
		console.log("winningTeamBetPoints is:"+winningTeamBetPoints);
		console.log("mom is:"+mom);
		console.log("actual mom is :"+mom.split(" - ")[1]);
		var finalMoM = mom.split(" - ")[1];
		console.log("momBetPoints is:"+momBetPoints);
		console.log("teamWinningToss is:"+teamWinningToss);
		console.log("teamWinningTossBetPoints is:"+teamWinningTossBetPoints);
		console.log("battingOrderBet is:"+battingOrderBet);
		console.log("battingOrderBetPoints is:"+battingOrderBetPoints);
		console.log("runsScoredInOver is:"+runsScoredInOver);
		console.log("runsScoredInOverBetPoints is:"+runsScoredInOverBetPoints);
		console.log("victoryMargin is:"+victoryMargin);
		console.log("victoryMarginBetPoints is:"+victoryMarginBetPoints);
		
		if( winningTeamBetPoints === '') {
			winningTeamBetPoints = 0;
		}
		if( momBetPoints === '') {
			momBetPoints = 0;
		}
		if( teamWinningTossBetPoints === '') {
			teamWinningTossBetPoints = 0;
		}
		if( battingOrderBetPoints === '') {
			battingOrderBetPoints = 0;
		}
		if( runsScoredInOverBetPoints === '') {
			runsScoredInOverBetPoints = 0;
		}
		if( victoryMarginBetPoints === '') {
			victoryMarginBetPoints = 0;
		}
		if( runsScoredInOver === '') {
			runsScoredInOver = null;
		}
		if( mom === "") {
			finalMoM = '';
		}
		console.log("victoryMarginBetPoints is:"+victoryMarginBetPoints);
		console.log("finalMoM is:"+finalMoM);
		
		if(action === "insert"){
			var insertNewBetsQuery = "insert into MATCH_BETTING_DETAILS (USER_ID, MATCH_ID, RESULT_TEAM_BET, RESULT_TEAM_BET_POINTS, TOSS_TEAM_BET, TOSS_TEAM_BET_POINTS, MOM_PERSON_BET, MOM_PERSON_BET_POINTS, RESULT_ORDER_BET, RESULT_ORDER_BET_POINTS, RUNS_IN_OVER_BET, RUNS_IN_OVER_BET_POINTS, VICTORY_MARGIN_BET, VICTORY_MARGIN_BET_POINTS, CREATED_DATE, MODIFIED_DATE) VALUES  ("+req.session.userId+","+match_id+", '"+winningTeam+"',"+winningTeamBetPoints+",'"+teamWinningToss+"',"+teamWinningTossBetPoints+",'"+finalMoM+"',"+momBetPoints+",'"+battingOrderBet+"',"+battingOrderBetPoints+","+runsScoredInOver+","+runsScoredInOverBetPoints+",'"+victoryMargin+"',"+victoryMarginBetPoints+",sysdate(), sysdate())";
			console.log("insertNewBetsQuery:"+insertNewBetsQuery);
			mysql.writeData(function(err){
				if(err){
					ejs.renderFile('./views/errorPage.ejs',{error : "111"},function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
					//throw err;
				}
				else{
					console.log("Insert Successful");
					myBetting(req,res);
				}
			},insertNewBetsQuery);			
		}else if(action === "edit"){
			var updateBetsQuery = "UPDATE MATCH_BETTING_DETAILS set RESULT_TEAM_BET = '"+winningTeam+"', "+
			"RESULT_TEAM_BET_POINTS = "+winningTeamBetPoints+", "+
			"TOSS_TEAM_BET = '"+teamWinningToss+"', "+
			"TOSS_TEAM_BET_POINTS = "+teamWinningTossBetPoints+", "+
			"MOM_PERSON_BET = '"+finalMoM+"', "+
			"MOM_PERSON_BET_POINTS = "+momBetPoints+", "+
			"RESULT_ORDER_BET = '"+battingOrderBet+"', "+
			"RESULT_ORDER_BET_POINTS = "+battingOrderBetPoints+", "+
			"VICTORY_MARGIN_BET = '"+victoryMargin+"', "+
			"VICTORY_MARGIN_BET_POINTS = "+victoryMarginBetPoints+", "+
			"RUNS_IN_OVER_BET = "+runsScoredInOver+", "+
			"RUNS_IN_OVER_BET_POINTS = "+runsScoredInOverBetPoints+" WHERE USER_ID ="+req.session.userId+" and match_id = "+match_id;
			console.log("update query:"+updateBetsQuery);
			mysql.writeData(function(err){
				if(err){
					ejs.renderFile('./views/errorPage.ejs',{error : "111"},function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
					//throw err;
				}
				else{
					console.log("Update Successful");
					myBetting(req,res);
				}
			},updateBetsQuery);			

		}		
	}

}

function logOut(req, res) {
	console.log("inside signOut");
	console.log("req.session.userName"+req.session.userName);
	req.session.fullName = undefined;
	console.log("after signout req.session.userName"+req.session.userName);
	req.session.userId = undefined;
	req.session.isLoggedin = false;
	req.session.destroy();
	res.redirect('/');
}


exports.signin=signin;
exports.homepage = homepage;
exports.myBetting = myBetting;
exports.displayBets = displayBets;
exports.enterBet = enterBet;
exports.placeBet = placeBet;
exports.logOut = logOut;
