SELECT 
	ps.monthly AS Month,
	children.name,
	COUNT(CASE 
		WHEN DATE(cdr.date) BETWEEN DATE(pe.enddate) AND DATE(pe.enddate) + INTERVAL '15 DAY' THEN 'Timely' 
	END) AS Timely,
	COUNT(CASE 
		WHEN cdr.periodid is NOT NULL AND DATE(cdr.date) NOT BETWEEN DATE(pe.enddate) AND DATE(pe.enddate) + INTERVAL '15 DAY' THEN 1
	END) AS Late,

	COUNT(CASE 
		WHEN cdr.periodid is NULL THEN 1
	END) AS Unreported,

	COUNT(*) AS Expected,

	COUNT(CASE 
		WHEN usermembership.organisationunitid = ou.organisationunitid THEN 1
	END) AS Self_submitted,

	-- orgunitgroupid for "PUBLIC" is 49380
	-- orgunitgroupid for "NON-PUBLIC" is 49381
	-- this has been intentionally hardcoded because of the performance loss when JOIN with orgunitgroup was done
	COUNT(CASE 
				WHEN orgunitgroupmembers.orgunitgroupid = 49380 THEN 1
	END) AS "PUBLIC",

	COUNT(CASE 
				WHEN orgunitgroupmembers.orgunitgroupid = 49381 THEN 1
	END) AS "NON_PUBLIC"
	
FROM organisationunit ou
JOIN orgunitlevel ON orgunitlevel.name= 'Health Facility' AND ou.hierarchylevel = orgunitlevel.level
JOIN organisationunit parent ON parent.path LIKE '%/${ouUid}'
JOIN organisationunit children ON 
	children.path LIKE '%/${ouUid}%' 
	AND ou.path LIKE CONCAT(children.path, '%')
	AND children.hierarchylevel = LEAST((parent.hierarchylevel  + 1), 6)
JOIN period pe ON pe.periodtypeid = (SELECT periodtypeid FROM periodtype WHERE name = 'Monthly')
JOIN _periodstructure ps ON ps.periodid = pe.periodid

LEFT JOIN completedatasetregistration cdr ON 
	cdr.sourceid = ou.organisationunitid 
	AND 
	cdr.periodid=pe.periodid 
	AND 
	(cdr.datasetid = 4628 OR cdr.datasetid = 4657)
LEFT JOIN users ON users.username = cdr.storedby
LEFT JOIN usermembership ON usermembership.userinfoid = users.userid AND  usermembership.organisationunitid = ou.organisationunitid 
-- orgunitgroupid for "PUBLIC" is 49380
-- orgunitgroupid for "NON-PUBLIC" is 49381
-- this has been intentionally hardcoded because of the performance loss when JOIN with orgunitgroup was done
JOIN orgunitgroupmembers
ON
orgunitgroupmembers.orgunitgroupid=${orgUnitGroupId} AND orgunitgroupmembers.organisationunitid = ou.organisationunitid

WHERE 
	ou.path LIKE '%/${ouUid}%' 
	AND
	ou.openingdate <= '${startDate}'
	AND
	(pe.startdate >= '${startDate}' AND pe.enddate <= '${endDate}')  -- Chaitra 2073
GROUP BY children.name, month
ORDER BY month DESC