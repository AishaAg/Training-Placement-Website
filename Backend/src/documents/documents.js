import path from 'path';
import pool from '../../db/dbConnection';
import queries from '../../db/queries';
import { __dirname } from '../config';
import fs from 'fs/promises';
export const fetchDocument = async (req, res) => {
	try {
		res.status(200).sendFile(
			`${req.params.document_id}.pdf`,
			{
				root: path.join(__dirname, `../documents/${req.params.document_type}`),
			},
			(err) => {
				if (err) {
					res.status(500).json({ message: 'Error while retrieving file.' });
					throw err;
				}
			}
		);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

export const uploadDocument = async (req, res) => {
	try {
		const documentId = await pool.query(queries.addDocument, [
			req.det.user,
			req.params.document_type,
		]);
		if (documentId.rowCount === 0) {
			return res
				.status(500)
				.json({ message: 'Server error, Please try again later.' });
		}
		console.log(req.files);
		const document = req.files[req.params.document_type];
		document.mv(
			path.join(
				__dirname,
				`../documents/${req.params.document_type}/${documentId.rows[0].document_id}.pdf`
			),
			async (err) => {
				if (err) {
					console.log(err);
					await pool.query(queries.deleteDocument, [
						documentId.rows[0].document_id,
					]);
					res.status(500).json({ message: 'Could not save file.' });
					throw err;
				}
			}
		);
		res.status(201).json({
			message: 'Document saved.',
			documentId: documentId.rows[0].document_id,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

export const deleteDocument = async (req, res) => {
	try {
		const documentId = await pool.query(queries.deleteDocument, [
			req.params.document_id,
		]);
		fs.unlink(
			path.join(
				__dirname,
				`../documents/${req.params.document_type}/${req.params.document_id}.pdf`
			),
			(err) => {
				if (err) {
					res.status(500).json({ message: 'Server error.' });
					throw err;
				}
			}
		);
		res.status(201).json({
			message: 'Document deleted.',
			documentId: documentId.rows[0].document_id,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};
