<!doctype html>
<html>
	<head>
		<script type="text/javascript" src="/scripts/ga.js"></script>
		<script type="text/javascript" src="/bower_components/jquery/dist/jquery.min.js"></script>
		<script type="text/javascript" src="/bower_components/underscore/underscore-min.js"></script>
		<script type="text/javascript" src="/bower_components/backbone/backbone.js"></script>
		<script type="text/javascript" src="/bower_components/handlebars/handlebars.min.js"></script>
		<script type="text/javascript" src="/bower_components/moment/min/moment.min.js"></script>
		<script type="text/javascript" src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="/bower_components/jstorage/jstorage.min.js"></script>
		<script type="text/javascript" src="/scripts/emilstabs.js"></script>

		<link href="/bower_components/bootstrap/dist/css/bootstrap.min.css" type="text/css" rel="stylesheet" />
	</head>
	<body>
		<div class="container">
			<div class="content">
				<div class="row">
					<div class="col-md-12">
						<h1>Loops</h1>
						<ul class="breadcrumb">
						  <li><a href="../../">Home</a> <span class="divider">/</span></li>
						  <li><a href="../">Loops</a> <span class="divider">/</span></li>
						  <li class="active">Sampled Loops</li>
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

