<!doctype html>
<html>
	<head>
		<script type="text/javascript" src="../components/ga.js"></script>
		<script type="text/javascript" src="../components/jquery/jquery.min.js"></script>
		<script type="text/javascript" src="../components/filter.js"></script>
		<link href="../components/bootstrap/css/bootstrap.css" type="text/css" rel="stylesheet" />
		<link href="../components/bootstrap/css/bootstrap-responsive.css" type="text/css" rel="stylesheet" />
	</head>
	<body>
		<div class="container">
			<div class="content">
				<div class="row">
					<div class="col-span-">
						<h1>Tabs</h1>
						<ul class="breadcrumb">
						  <li><a href="../">Home</a></li>
						  <li class="active">Tabs</li>
						</ul>
						<input type="text" id="filter" name="filter" placeholder="Filter"><br><br>
						<table class="table table-striped table-bordered table-condensed searchable">
							<tbody>
							<?php
							$directory = "";
							$tabs = glob($directory . "*.txt");
							foreach ($tabs as $file) {
							?>
							<tr data-search="<?php echo strtolower($file)?>">
								<td><a href="<?php echo $file; ?>"><?php echo $file; ?></a></td>
							</tr>
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

