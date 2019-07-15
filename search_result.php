/*
 contains my previous web development work using PHP, SQL, HTML, CSS
 prints restaurant image and name according to search input
*/

<html>
    <style>
        .column {
	        display: inline-block;
	        padding: 15px;
        }
        corners {
        	border-radius: 25px;
        }
        table {
            align-content: middle;
            vertical-align: middle;
            background-color: rgba(255,255,255,0.75);
        }
        table td {
            vertical-align: middle;
            border-bottom-style: none;
        }
        table:hover table:focus{
            background-color: white;
        }
        main {
            background-image: url("http://champaignil.gov/wp-content/uploads/2016/02/Campustown.jpg");
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-position: center center;
        }
    </style>
</html>

<?php get_header(); ?>

	<div id="content-wrap" class="container clr">

		<html>
			<head>
				<link rel="stylesheet" type="text/css" href="search.css">
			</head>

			<?php

			$db = new mysqli("...", "...", 
							 "....","..."); #confidential
			if ($db->connect_error) {
				echo "Connect Error: " . $db->connect_error;
			}
			$n = mysqli_real_escape_string($db, get_query_var('s'));
			$sql = "SELECT rid, link, cuisine, acc_rating, img_out
					FROM restaurants
					WHERE rid LIKE '%$n%' OR cuisine LIKE '%$n%' OR acc_rating LIKE '$n'
					ORDER BY rid ASC";
			$result = mysqli_query($db, $sql);
			$num_rows = mysqli_num_rows($result);

			if ($num_rows > 0){?>
				<center>
					<h1>
						<span id="corners" style="background-color: rgba(255,255,255,0.75)">
						&nbsp <?php echo $num_rows?> Restaurants Found. &nbsp
						</span>
					</h1>
				</center>
				<br>

				<?php
				while ( $row = $result->fetch_assoc() ){
					?>
					<div class="column" style="vertical-align:middle; text-align:center">
						<a href="<?php echo $row['link']?>">
							<table id="corners" style="width:250px">
								<tr style="height:200px">
									<td valign="center">
										<center>
											<img src="<?php echo $row['img_out']?>" 
												 width="170" align="middle" alt="<?php $row['rid']?>">
										</center>
									</td>
								</tr>
								<tr>
									<td>
										<center><h4><?php echo $row['rid']?></h4></center>
									</td>
								</tr>
							</table>
						</a>
					</div>
				<?php
				}
				$result->free();
			}else{?>
				<center>
					<h1>
						<span id="corners" style="background-color: rgba(255,255,255,0.75)">
						&nbsp No Restaurant Found. &nbsp
						</span>
					</h1><br>
					<table id="corners" style="width:40%">
						<tr style="height:200px">
							<td valign="center">
								<center>
									<font size="+1">
										<b>
										Please try something else.<br>
										You can search by restaurant's Name; <br>
										Cuisine: American, Mexican, Italian, etc. <br>
										Food: pizza, burger, steak, wings, etc.<br>
										Accessibility rating: excellent, good, limited.
										</b>
									</font>
								</center>
							</td>
						</tr>
					</table>
				<br><br><br><br><br><br><br><br><br>
				</center>
				<?php
			}

			?>
		</html>
</div>

<?php get_footer(); ?>
