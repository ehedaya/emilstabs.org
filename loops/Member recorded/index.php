<!doctype html>
<html>
	<head>
		<script type="text/javascript" src="../../components/ga.js"></script>
		<link href="../../components/bootstrap/docs/bootstrap.css" type="text/css" rel="stylesheet" />
		<link href="../../components/bootstrap/docs/bootstrap-responsive.css" type="text/css" rel="stylesheet" />
	</head>
	<body>
		<div class="container">
			<div class="content">
				<div class="row">
					<div class="span12">
						<h1>Loops</h1>
						<ul class="breadcrumb">
						  <li><a href="../../">Home</a></li>
						  <li><a href="../">Loops</a></li>
						  <li class="active">Member recorded Loops</li>
						</ul>
						<ul class="media-list">
							<?php
							$directory = "";
							$loops = glob($directory . "*.swf");
							foreach ($loops as $loop) {
							?>
							<li class="media">
								<div class="media-body">
									<object type="application/x-shockwave-flash" 
									  data="<?php echo $loop; ?>" 
									  width="300" height="100">
									  <param name="movie" value="<?php echo $loop; ?>" />
									  <param name="quality" value="high"/>
									</object>
								</div>
							</li>
							<?php
							}
							?>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>

