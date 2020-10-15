CREATE VIEW vw_article AS
SELECT
    a.id AS "id",
    a.title AS "title",
    a.created_at AS "created_at",
    a.updated_at AS "updated_at",
    COUNT(c.id) AS "nb_comment"
FROM article AS a
LEFT OUTER JOIN comment AS c ON c.article_id = a.id
GROUP BY a.id
ORDER BY a.created_at ASC;